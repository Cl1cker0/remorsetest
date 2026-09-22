import {
  SHOP_CURRENCY,
  SHOP_ID,
  SHOP_URL,
  type Category,
  type Product,
  type Review,
  type Store,
  type Variant,
} from "@/lib/sellauth";

const API_BASE = "https://api.sellauth.com/v1";
const STORAGE_ORIGIN = "https://api.sellauth.com/storage/images/";

type RawImage = { url?: string; pivot?: { order?: number } };
type RawVariant = {
  id: number;
  name: string;
  price?: string | number | null;
  order?: number | null;
  quantity_min?: number | null;
  quantity_max?: number | null;
  stock?: number | null;
};
type RawProduct = {
  id: number;
  name: string;
  path?: string | null;
  description?: string | null;
  instructions?: string | null;
  visibility?: string | null;
  dashboard_order?: number | null;
  sort_priority?: number | null;
  products_sold?: number | null;
  images?: RawImage[] | null;
  variants?: RawVariant[] | null;
  deliverables_type?: string | null;
};
type RawCategory = {
  id: number;
  name: string;
  path?: string | null;
  order?: number | null;
  visibility?: string | null;
  products?: Array<{ id?: number; product_id?: number }> | null;
};
type RawFeedback = {
  id: number;
  product_id?: number | number[] | null;
  rating?: number | string | null;
  score?: number | string | null;
  feedback?: string | null;
  comment?: string | null;
  content?: string | null;
  message?: string | null;
  reply?: string | null;
  seller_reply?: string | null;
  response?: string | null;
  created_at?: string | null;
};
type Paginated<T> = {
  data?: T[];
};

function apiKey() {
  const key = process.env.SELLAUTH_API_KEY;
  if (!key) throw new Error("SELLAUTH_API_KEY is not set.");
  return key;
}

function shopId() {
  const raw = process.env.SELLAUTH_SHOP_ID;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : SHOP_ID;
}

function shopUrl() {
  return process.env.SELLAUTH_SHOP_URL || SHOP_URL;
}

async function sellAuthFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/shops/${shopId()}${path}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`SellAuth request failed (${response.status}): ${path}`);
  }
  return (await response.json()) as T;
}

function imageUrls(images?: RawImage[] | null) {
  if (!images?.length) return [];
  return [...images]
    .sort((a, b) => (a.pivot?.order ?? 0) - (b.pivot?.order ?? 0))
    .map((image) => {
      if (!image.url) return null;
      if (/^https?:\/\//i.test(image.url)) return image.url;
      return STORAGE_ORIGIN + image.url.replace(/^\/+/, "");
    })
    .filter((url): url is string => Boolean(url));
}

function mapVariant(raw: RawVariant, isSerial: boolean): Variant {
  const cost = Number(raw.price ?? 0);
  // Serial stock is the count of unsold keys. SellAuth sends null when none are loaded.
  // Non-serial null still means unlimited.
  const stock = raw.stock == null && isSerial ? 0 : raw.stock;
  return {
    id: String(raw.id),
    name: raw.name || "Option",
    cost: Number.isFinite(cost) ? cost : 0,
    order: raw.order ?? 0,
    minimumQuantity: raw.quantity_min && raw.quantity_min > 0 ? raw.quantity_min : 1,
    maximumQuantity:
      raw.quantity_max && raw.quantity_max > 0 ? raw.quantity_max : undefined,
    stock,
    isOutOfStock: stock === 0,
  };
}

function mapProduct(raw: RawProduct): Product {
  const images = imageUrls(raw.images);
  const description = raw.description?.trim() || undefined;
  const isSerial = raw.deliverables_type === "serials";
  return {
    id: String(raw.id),
    name: raw.name,
    description,
    slug: raw.path || String(raw.id),
    imageNames: images,
    variants: (raw.variants || []).map((variant) =>
      mapVariant(variant, isSerial),
    ),
    visibility: raw.visibility === "public" ? 0 : 1,
    order: raw.dashboard_order ?? raw.sort_priority ?? 0,
    isBestSeller: (raw.products_sold ?? 0) > 0,
  };
}

function mapCategory(raw: RawCategory): Category {
  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.path || String(raw.id),
    visibility: raw.visibility === "public" ? 0 : 1,
    order: raw.order ?? 0,
    products: (raw.products || [])
      .map((entry) => String(entry.product_id ?? entry.id ?? ""))
      .filter(Boolean),
  };
}

function mapFeedback(raw: RawFeedback): Review {
  const productIds = Array.isArray(raw.product_id)
    ? raw.product_id
    : raw.product_id != null
      ? [raw.product_id]
      : [];
  const rating = Number(raw.rating ?? raw.score ?? 5);
  return {
    id: String(raw.id),
    productId: productIds.length ? String(productIds[0]) : "",
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 5,
    reason:
      raw.feedback?.trim() ||
      raw.comment?.trim() ||
      raw.content?.trim() ||
      raw.message?.trim() ||
      "",
    reply: raw.reply || raw.seller_reply || raw.response || undefined,
    dateCreated: raw.created_at || new Date().toISOString(),
  };
}

export async function fetchStore(): Promise<Store> {
  const [productsRes, categoriesRes] = await Promise.all([
    sellAuthFetch<Paginated<RawProduct> | RawProduct[]>("/products?perPage=100"),
    sellAuthFetch<Paginated<RawCategory> | RawCategory[]>("/categories?perPage=100"),
  ]);
  const productList = Array.isArray(productsRes) ? productsRes : productsRes.data || [];
  const categoryList = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || [];
  return {
    name: "Remorse",
    description: "Software for the Game Rust",
    url: shopUrl(),
    currencyCode: SHOP_CURRENCY,
    products: productList.map(mapProduct),
    categories: categoryList.map(mapCategory),
  };
}

export async function fetchReviews(productId?: string): Promise<Review[]> {
  const query = new URLSearchParams({ perPage: "100" });
  if (productId && productId !== "all") query.set("product", productId);
  const response = await sellAuthFetch<Paginated<RawFeedback> | RawFeedback[]>(
    `/feedbacks?${query.toString()}`,
  );
  const list = Array.isArray(response) ? response : response.data || [];
  return list.map(mapFeedback);
}
