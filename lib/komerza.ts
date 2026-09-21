export const STORE_ID = "a0b99dc2-df0c-4e46-b179-b2c017b43415";
export const MEDIA_ORIGIN = "https://user-generated-content.komerza.com/";
export type Variant = {
  id: string;
  name: string;
  cost: number;
  order?: number;
  imageNames?: string[];
  minimumQuantity?: number;
  maximumQuantity?: number;
  stock?: number;
  stockMode?: number;
  isOutOfStock?: boolean;
  hideStock?: boolean;
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
  branding?: { iconFileName?: string };
  rating?: number;
};
export type Review = {
  id: string;
  productId: string;
  rating: number;
  reason: string;
  reply?: string;
  dateCreated: string;
};
export type Response<T> = {
  success: boolean;
  data?: T;
  message?: string;
  pages?: number;
};
export type BasketItem = {
  productId: string;
  variantId: string;
  quantity: number;
};
export type KomerzaClient = {
  init: (id: string) => void;
  getStore: () => Promise<Response<Store>>;
  getProduct: (id: string) => Promise<Response<Product>>;
  getProductReviews: (id: string, page: number) => Promise<Response<Review[]>>;
  getBasket: () => BasketItem[];
  addToBasket: (product: string, variant: string, quantity: number) => void;
  removeFromBasket: (product: string, variant: string) => void;
  checkout: (email: string, coupon?: string) => Promise<Response<unknown>>;
};
declare global {
  interface Window {
    komerza?: KomerzaClient;
  }
}
export function imageUrl(name?: string) {
  return name ? MEDIA_ORIGIN + encodeURIComponent(name) : undefined;
}
export function productImage(product: Product, variant?: Variant) {
  return imageUrl(variant?.imageNames?.[0] || product.imageNames?.[0]);
}
export function price(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(value);
}
export function maxQuantity(variant: Variant) {
  const limit =
    variant.maximumQuantity && variant.maximumQuantity > 0
      ? variant.maximumQuantity
      : Infinity;
  return variant.isOutOfStock
    ? 0
    : Math.min(
        limit,
        variant.stockMode === 1 ? Infinity : (variant.stock ?? 0),
      );
}
export function publicProducts(store: Store) {
  return (store.products || [])
    .filter((p) => !p.visibility)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
