export const SHOP_ID = 270710;
export const SHOP_URL = "https://remorse-dev.mysellauth.com";
export const SHOP_CURRENCY = "USD";

export type Variant = {
  id: string;
  name: string;
  cost: number;
  order?: number;
  imageNames?: string[];
  minimumQuantity?: number;
  maximumQuantity?: number;
  stock?: number | null;
  isOutOfStock?: boolean;
  deliveryTypes?: string[];
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  imageNames?: string[];
  variants: Variant[];
  visibility?: number;
  order?: number;
  rating?: number;
  isBestSeller?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  visibility?: number;
  order?: number;
  products: string[];
};

export type Store = {
  name: string;
  description?: string;
  url: string;
  currencyCode: string;
  products: Product[];
  categories: Category[];
  maintenanceReason?: string;
};

export type Review = {
  id: string;
  productId: string;
  rating: number;
  reason: string;
  reply?: string;
  dateCreated: string;
};

export type BasketItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type SellAuthCartLine = {
  productId: number;
  variantId?: number;
  quantity: number;
};

export type SellAuthOpenOptions = {
  shopId: number;
  shopUrl: string;
  cart: SellAuthCartLine[];
  theme?: "auto" | "light" | "dark";
  modal?: boolean;
  newTab?: boolean;
  skipCart?: boolean;
  closeButton?: boolean;
  shopCard?: boolean;
  ticketPanel?: boolean;
  currency?: string;
  email?: string;
  affiliate?: string;
  locale?: string;
  returnUrl?: string;
  scrollTop?: boolean;
  onSuccess?: (detail: { invoiceId?: string | number }) => void;
  onClose?: (detail?: { reason?: string }) => void;
};

export type SellAuthClient = {
  open: (options: SellAuthOpenOptions) => { close?: () => void };
  close: () => void;
  on: (type: string, callback: (event: unknown) => void) => void;
  off: (type: string, callback: (event: unknown) => void) => void;
  version?: string;
};

declare global {
  interface Window {
    sellAuth?: SellAuthClient;
  }
}

export function imageUrl(src?: string) {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return src;
}

export function productImage(product: Product, variant?: Variant) {
  return imageUrl(variant?.imageNames?.[0] || product.imageNames?.[0]);
}

export function price(value: number, currency = SHOP_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value);
}

export function isVariantAvailable(variant: Variant) {
  return maxQuantity(variant) >= Math.max(1, variant.minimumQuantity ?? 1);
}

export function firstAvailableVariant(variants: Variant[]) {
  return variants.find(isVariantAvailable) ?? variants[0];
}

export function maxQuantity(variant: Variant) {
  if (variant.isOutOfStock || variant.stock === 0) return 0;
  const limit =
    variant.maximumQuantity && variant.maximumQuantity > 0
      ? variant.maximumQuantity
      : Infinity;
  const stock =
    variant.stock === null || variant.stock === undefined
      ? Infinity
      : variant.stock;
  return Math.min(limit, stock);
}

export function publicProducts(store: Store) {
  return (store.products || [])
    .filter((p) => !p.visibility)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function openSellAuthCheckout(options: {
  cart: BasketItem[];
  email?: string;
  theme?: "auto" | "light" | "dark";
}) {
  const client = window.sellAuth;
  if (!client?.open) return false;
  const cart: SellAuthCartLine[] = options.cart.map((item) => ({
    productId: Number(item.productId),
    variantId: Number(item.variantId),
    quantity: item.quantity,
  }));
  if (!cart.length || cart.some((line) => !Number.isFinite(line.productId) || line.productId <= 0)) {
    return false;
  }
  client.open({
    shopId: SHOP_ID,
    shopUrl: SHOP_URL,
    cart,
    theme: options.theme ?? "dark",
    // Full checkout page instead of the modal embed, straight past the cart review.
    modal: false,
    newTab: false,
    skipCart: true,
    ...(options.email ? { email: options.email } : {}),
  });
  return true;
}
