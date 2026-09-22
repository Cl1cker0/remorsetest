"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bag,
  CheckCircle,
  Fingerprint,
  Key,
  Minus,
  Plus,
  Quotes,
  ShieldCheck,
  Star,
  Trash,
  X,
} from "@phosphor-icons/react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import ScrollDirector from "./scroll-director";
import MobileMenu from "./mobile-menu";
import ProductDetail from "./product-detail";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  imageUrl,
  productImage,
  price,
  maxQuantity,
  isVariantAvailable,
  firstAvailableVariant,
  openSellAuthCheckout,
  publicProducts,
  type BasketItem,
  type Product,
  type Review,
  type Store,
  type Variant,
} from "@/lib/sellauth";
import SilkBackground from "./silk-background";
import Reveal from "./reveal";

const CART_STORAGE_KEY = "remorse-cart";

function Arrow() {
  return (
    <span className="button-icon">
      <ArrowUpRight size={18} />
    </span>
  );
}
function Brand() {
  return (
    <a className="brand" href="/#top" aria-label="Remorse home">
      <span className="brand-logo-shell" aria-hidden="true">
        <Image
          className="brand-logo-image"
          src="/brand/remorse-symbol.png"
          alt=""
          width={32}
          height={32}
        />
      </span>
      <span>
        remorse<span className="brand-domain">.dev</span>
      </span>
    </a>
  );
}

function ProductCard({
  product,
  currency,
  add,
  maintenance,
}: {
  product: Product;
  currency: string;
  add: (p: Product, v: Variant) => void;
  maintenance: boolean;
}) {
  const variants = [...product.variants].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const [selected, setSelected] = useState(firstAvailableVariant(variants)?.id);
  const [imageIndex, setImageIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const variant = variants.find((v) => v.id === selected) ?? firstAvailableVariant(variants);
  const images = variant?.imageNames?.length
    ? variant.imageNames
    : product.imageNames || [];
  const available = variant ? isVariantAvailable(variant) : false;
  return (
    <Reveal className="product-shell">
      <article
        className="product-card"
        id={`product-${product.slug || product.id}`}
      >
        <div className="product-media">
          {images.length > 0 && !failed ? (
            <img
              className="product-photo"
              src={imageUrl(images[imageIndex] || images[0])}
              alt={product.name}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="image-unavailable">
              <span>r.</span>
              <p>Product image unavailable</p>
            </div>
          )}
          {images.length > 1 && (
            <div className="gallery-controls">
              {images.map((img, index) => (
                <button
                  key={img}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  onClick={() => {
                    setImageIndex(index);
                    setFailed(false);
                  }}
                >
                  <img src={imageUrl(img)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-copy">
          <div className="product-badges">
            {product.isBestSeller && <span>Featured product</span>}
            <span className={available ? "availability" : ""}>
              {available ? (
                <>
                  <i /> In stock
                </>
              ) : (
                "Out of stock"
              )}
            </span>
          </div>
          <h3>{product.name}</h3>
          <p className="product-description">
            {product.description ||
              "Explore this product and choose the option that fits you."}
          </p>
          <div className="product-attributes">
            <span>
              <Key size={17} />
              {variant?.deliveryTypes?.includes("license_keys")
                ? "License key delivery"
                : "Digital product"}
            </span>
            <span>
              <ShieldCheck size={17} />
              Secure payment
            </span>
          </div>
          {variants.length > 1 && (
            <label className="variant-label">
              Choose your option
              <select
                value={variant?.id}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setImageIndex(0);
                  setFailed(false);
                }}
              >
                {variants.map((v) => (
                  <option value={v.id} key={v.id} disabled={!isVariantAvailable(v)}>
                    {v.name} · {price(v.cost, currency)}
                    {isVariantAvailable(v) ? "" : " · Out of stock"}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="product-purchase">
            <div>
              <span className="price-caption">
                {variants.length > 1 ? variant?.name : "Your price"}
              </span>
              <strong>
                {variant ? price(variant.cost, currency) : "Unavailable"}
              </strong>
            </div>
            <button
              className="primary-button"
              disabled={!available || maintenance}
              onClick={() => variant && add(product, variant)}
            >
              {available ? "Add to cart" : "Out of stock"}{" "}
              <span className="button-icon">
                {available ? <Plus size={18} /> : null}
              </span>
            </button>
          </div>
          <p className="purchase-note">Delivery details are provided after payment confirmation.</p>
        </div>
      </article>
    </Reveal>
  );
}

function Reviews({
  products,
  ready,
  unavailable,
  onSettled,
}: {
  products: Product[];
  ready: boolean;
  unavailable: boolean;
  onSettled?: () => void;
}) {
  const [filter, setFilter] = useState("all");
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const productKey = products.map((p) => p.id).join(",");
  useEffect(() => {
    if (!ready) return;
    let current = true;
    const params = new URLSearchParams();
    if (filter !== "all") params.set("productId", filter);
    setLoading(true);
    setError("");
    fetch(`/api/feedbacks?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Reviews could not be loaded.");
        const data = (await response.json()) as { reviews?: Review[] };
        if (!current) return;
        const next = (data.reviews || []).sort(
          (a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated),
        );
        setAllReviews(next);
        setHasMore(false);
      })
      .catch(() => {
        if (current) setError("Reviews could not be loaded. Please try again.");
      })
      .finally(() => {
        if (current) {
          setLoading(false);
          onSettled?.();
        }
      });
    return () => {
      current = false;
    };
  }, [ready, productKey, filter, retry, onSettled]);
  const reviews = allReviews.slice(0, page * 12);
  if (!unavailable && loading && !allReviews.length && !error) {
    return <section id="reviews" className="section reviews-section" role="status" aria-label="Loading reviews" aria-busy="true">
      <div aria-hidden="true">
        <div className="skeleton-block skeleton-review-heading" />
        <div className="reviews-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>
      </div>
    </section>;
  }
  return (
    <section id="reviews" className="section reviews-section">
      <Reveal>
        <div className="section-heading">
          <span className="section-kicker">THE COMMUNITY</span>
          <h2>
            What our <span>users say.</span>
          </h2>
          <p>Real experiences. In their own words.</p>
        </div>
      </Reveal>
      {products.length > 1 && (
        <label className="review-filter">
          Reviews for
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
              setAllReviews([]);
            }}
          >
            <option value="all">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {error ? (
        <div className="state-panel" role="status">
          <p>{error}</p>
          <button
            className="text-button"
            onClick={() => setRetry((v) => v + 1)}
          >
            Try again <ArrowRight />
          </button>
        </div>
      ) : unavailable ? (
        <div className="state-panel" role="status"><p>Reviews are unavailable while the store is disconnected. Retry the store connection above.</p></div>
      ) : loading && !allReviews.length ? (
        <div className="reviews-loading" aria-label="Loading reviews">
          <div />
          <div />
        </div>
      ) : !allReviews.length ? (
        <Reveal>
          <div className="review-empty">
            <div className="quote-emblem">
              <Quotes size={42} weight="light" />
            </div>
            <div>
              <span className="subtle-label">A NEW CHAPTER</span>
              <h3>Your experience belongs here.</h3>
              <p>
                No published reviews yet. When customers share their experience,
                you’ll find it here.
              </p>
              <a className="text-button" href="/#products">
                Explore the collection <ArrowRight size={18} />
              </a>
            </div>
            <div className="empty-stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star size={21} weight="light" key={n} />
              ))}
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="review-grid">
          {reviews.map((review) => (
            <Reveal key={review.id}>
              <article className="review-card">
                <div
                  className="review-stars"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      size={17}
                      weight={n <= review.rating ? "fill" : "regular"}
                      key={n}
                    />
                  ))}
                </div>
                <blockquote>{review.reason}</blockquote>
                <div className="review-attribution">
                  <span className="review-avatar">
                    <Fingerprint size={23} />
                  </span>
                  <div>
                    <strong>Customer review</strong>
                    <span>
                      {products.find((p) => p.id === review.productId)?.name ||
                        "Remorse"}
                    </span>
                  </div>
                  <time dateTime={review.dateCreated}>
                    {new Date(review.dateCreated).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {review.reply && (
                  <p className="merchant-reply">
                    <strong>Remorse replied</strong>
                    {review.reply}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      )}
      {hasMore && !error && (
        <button
          className="secondary-button more-reviews"
          disabled={loading}
          onClick={() => setPage((v) => v + 1)}
        >
          {loading ? "Loading..." : "Load more reviews"}
          <Plus size={18} />
        </button>
      )}
    </section>
  );
}

const faqs = [
  [
    "How do I get started?",
    "Choose a product, select an option if available, and add it to your cart. Enter your email at checkout and follow the payment instructions.",
  ],
  [
    "How will I receive my purchase?",
    "Delivery details are provided after payment confirmation. Keep your checkout email and order confirmation so you can access your purchase.",
  ],
  [
    "Which payment methods can I use?",
    "Available payment methods appear during checkout. Availability can depend on the product and your region.",
  ],
  [
    "Can I change my cart before paying?",
    "Yes. Open your cart to adjust quantities or remove products. Quantities must stay within the available stock and the product’s purchase limits.",
  ],
  [
    "Where can I get help with an order?",
    "Use the order link in your confirmation email to view your purchase and access the available support options. Always include your order ID when requesting help.",
  ],
];

function ProductSkeleton() {
  return <section className="section detail-section" role="status" aria-label="Loading product" aria-busy="true">
    <div className="detail-layout product-loading" aria-hidden="true">
      <div><div className="skeleton-block skeleton-gallery" /><div className="skeleton-thumbs">{[0,1,2,3].map(i => <div className="skeleton-block" key={i} />)}</div></div>
      <div className="skeleton-info"><div className="skeleton-block skeleton-title" /><div className="skeleton-block skeleton-line" /><div className="skeleton-block skeleton-price" /><div className="skeleton-options">{[0,1,2,3].map(i => <div className="skeleton-block" key={i} />)}</div><div className="skeleton-block skeleton-button" /></div>
    </div>
  </section>;
}

function readStoredCart(): BasketItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BasketItem =>
        item &&
        typeof item.productId === "string" &&
        typeof item.variantId === "string" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function writeStoredCart(items: BasketItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export default function Storefront({productSlug}: {productSlug?: string}) {
  const [reviewsSettled, setReviewsSettled] = useState(false);
  const finishReviews = useCallback(() => setReviewsSettled(true), []);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailError, setDetailError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const homeLoading = !productSlug && (status === "loading" || (status === "ready" && !reviewsSettled));
  useEffect(() => {
    if (!homeLoading) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [homeLoading]);
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => {
      setStatus("error");
      setError("The store connection couldn’t load. Refresh the page to try again.");
    }, 15000);
    return () => clearTimeout(timer);
  }, [status]);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<BasketItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [email, setEmail] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const dialog = useRef<HTMLDialogElement>(null);
  const syncCart = useCallback((next?: BasketItem[]) => {
    const items = next ?? readStoredCart();
    setCart(items);
  }, []);
  const loadStore = useCallback(async () => {
    setStatus("loading");
    setReviewsSettled(productSlug ? true : false);
    setDetailProduct(null);
    setDetailError("");
    setError("");
    try {
      const response = await fetch("/api/store", { cache: "no-store" });
      if (!response.ok) throw new Error("The store could not be loaded.");
      const data = (await response.json()) as Store;
      if (!data || !Array.isArray(data.products))
        throw new Error("The store could not be loaded.");
      setStore(data);
      if (productSlug) {
        const products = publicProducts(data);
        const detail =
          products.find((p) => p.slug === productSlug) ||
          products.find((p) => p.id === productSlug);
        if (detail) setDetailProduct(detail);
        else setDetailError("This product is unavailable.");
      }
      setStatus("ready");
      syncCart();
    } catch {
      setError("We couldn’t connect to the store. Please try again.");
      setStatus("error");
    }
  }, [productSlug, syncCart]);
  useEffect(() => {
    void loadStore();
  }, [loadStore]);
  useEffect(() => {
    setCart(readStoredCart());
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === CART_STORAGE_KEY) syncCart();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncCart]);
  useEffect(() => {
    const element = dialog.current;
    if (cartOpen) {
      element?.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
        element?.close();
      };
    }
    element?.close();
  }, [cartOpen]);
  const products = store ? publicProducts(store) : [];
  const categories = (store?.categories || [])
    .filter((c) => !c.visibility)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const visibleProducts =
    category === "all"
      ? products
      : products.filter((p) =>
          categories.find((c) => c.id === category)?.products?.includes(p.id),
        );
  const currency = store?.currencyCode || "USD";
  const maintenance = Boolean(store?.maintenanceReason);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartLines = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId) || (detailProduct?.id === item.productId ? detailProduct : undefined);
    return {
      item,
      product,
      variant: product?.variants.find((v) => v.id === item.variantId),
    };
  });
  const cartInvalid = cartLines.some(
    ({ item, variant }) =>
      !variant ||
      item.quantity > maxQuantity(variant) ||
      item.quantity < Math.max(1, variant.minimumQuantity ?? 1),
  );
  const subtotal = cartLines.reduce(
    (total, line) => total + (line.variant?.cost || 0) * line.item.quantity,
    0,
  );
  function openCart() {
    syncCart();
    setMenuOpen(false);
    setCartOpen(true);
  }
  function add(product: Product, variant: Variant, requestedQuantity?: number) {
    const quantity = requestedQuantity ?? Math.max(1, variant.minimumQuantity ?? 1);
    const current = readStoredCart();
    const existing =
      current.find(
        (i) => i.productId === product.id && i.variantId === variant.id,
      )?.quantity || 0;
    if (existing + quantity > maxQuantity(variant)) {
      setCartMessage(
        "You’ve reached the available quantity for this option. Adjust your cart below.",
      );
      syncCart(current);
      openCart();
      return;
    }
    const next = existing
      ? current.map((i) =>
          i.productId === product.id && i.variantId === variant.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      : [
          ...current,
          {
            productId: product.id,
            variantId: variant.id,
            quantity,
          },
        ];
    writeStoredCart(next);
    syncCart(next);
    setCartMessage(`${product.name} added to your cart.`);
    openCart();
  }
  function remove(item: BasketItem) {
    const next = readStoredCart().filter(
      (i) => !(i.productId === item.productId && i.variantId === item.variantId),
    );
    writeStoredCart(next);
    syncCart(next);
    setCartMessage("Item removed.");
  }
  function changeQuantity(
    item: BasketItem,
    variant: Variant,
    quantity: number,
  ) {
    if (
      quantity < Math.max(1, variant.minimumQuantity ?? 1) ||
      (quantity > maxQuantity(variant) && quantity >= item.quantity)
    )
      return;
    const next = readStoredCart().map((i) =>
      i.productId === item.productId && i.variantId === item.variantId
        ? { ...i, quantity }
        : i,
    );
    writeStoredCart(next);
    syncCart(next);
    setCartMessage("");
  }
  function checkout() {
    if (cartInvalid || !cart.length || maintenance) return;
    setCheckingOut(true);
    setCartMessage("");
    // Release the dialog top layer for the SellAuth modal.
    dialog.current?.close();
    setCartOpen(false);
    const opened = openSellAuthCheckout({
      cart,
      email: email.trim() || undefined,
      theme: "dark",
    });
    if (!opened) {
      dialog.current?.showModal();
      setCartOpen(true);
      setCartMessage(
        sdkReady
          ? "Checkout couldn’t start. Please try again."
          : "Checkout is still loading. Try again in a moment.",
      );
    } else {
      setCartMessage("");
    }
    setCheckingOut(false);
  }
  return (
    <>
      <SilkBackground enabled />
      <ScrollDirector ready={status === "ready" && !homeLoading} detail={Boolean(productSlug)} enabled />
      <div className="ambient-shade" aria-hidden="true" />
      <a className="skip-link" href={productSlug ? "#product-detail" : "#products"}>
        Skip to products
      </a>
      <Script
        src="https://static.sellauth.com/embed/v3.min.js"
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onError={() => {
          // Store browsing still works; checkout reports when the embed is missing.
          setSdkReady(false);
        }}
      />
      {homeLoading && <div className="store-loading" role="status" aria-label="Loading store" aria-busy="true"><div className="loading-dots" aria-hidden="true">{Array.from({length: 24}, (_, i) => <i key={i} style={{"--dot-index": i, opacity: Math.max(.12, 1 - i * .07)} as CSSProperties} />)}</div></div>}
      <div className="store-content" inert={homeLoading} style={homeLoading ? {visibility: "hidden"} : undefined}>
      <header className="site-header">
        <Brand />
        <nav
          className="navigation"
          aria-label="Main navigation"
        >
          {[
            ["Products", "products"],
            ["Why Remorse", "why-remorse"],
            ["Reviews", "reviews"],
            ["FAQ", "faq"],
          ].map(([label, id]) => (
            <a key={id} href={`${productSlug ? "/" : ""}#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="cart-button"
            onClick={openCart}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <Bag size={18} />
            <span>Cart</span>
            <b>{cartCount}</b>
          </button>
          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} close={closeMenu}/>
      <main id={productSlug ? "product-detail" : undefined}>
        {productSlug ? <>{detailProduct ? <ProductDetail product={detailProduct} currency={currency} add={add} maintenance={maintenance}/> : detailError || status === "error" ? <section className="section detail-section"><div className="state-panel"><h1>{detailError || error}</h1><Link href="/#products">Back to products</Link></div></section> : <ProductSkeleton />}<Reviews products={detailProduct ? [detailProduct] : []} ready={status === "ready"} unavailable={status === "error"}/></> : <>
        <section className="hero section" id="top">
          <div className="hero-content">
            <span className="hero-label">
              <span className="tiny-mark">R</span> THE REMORSE EXPERIENCE
            </span>
            <h1>
              <span className="hero-line hero-line-first">Play your way.</span>
              <span className="hero-line hero-line-second">Without limits.</span>
            </h1>
            <p>
              A different kind of edge. Discover Remorse and make your next
              session your own.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#products">
                Explore products <Arrow />
              </a>
              <a className="hero-secondary" href="#why-remorse">
                Discover Remorse <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <span>BUILT FOR YOUR NEXT SESSION</span>
            <a href="#products" aria-label="Scroll to products">
              <ArrowDown size={18} />
            </a>
            <span>MAKE IT YOURS.</span>
          </div>

        </section>
        <section className="section products-section" id="products">
          <Reveal>
            <div className="section-heading">
              <h2>
                Your next <span>advantage.</span>
              </h2>
              <p>Find your fit. Make your move.</p>
            </div>
          </Reveal>
          <div className="catalog-bar">
            <div className="category-tabs" aria-label="Product categories">
              <button
                aria-pressed={category === "all"}
                onClick={() => setCategory("all")}
              >
                All products <span>{products.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  {c.name}
                  <span>
                    {products.filter((p) => c.products?.includes(p.id)).length}
                  </span>
                </button>
              ))}
            </div>
            <span className="catalog-caption">THE OFFICIAL REMORSE STORE</span>
          </div>
          {maintenance && (
            <p className="state-panel" role="status">
              {store?.maintenanceReason}
            </p>
          )}
          {status === "loading" ? (
            <div className="product-skeleton" aria-label="Loading products" />
          ) : status === "error" ? (
            <div className="state-panel" role="alert">
              <h3>Connection interrupted</h3>
              <p>{error}</p>
              <button
                className="text-button"
                onClick={() => loadStore()}
              >
                Try again <ArrowRight />
              </button>
            </div>
          ) : !visibleProducts.length ? (
            <div className="state-panel">
              <h3>
                {category === "all"
                  ? "The next drop is on its way."
                  : "No products in this category yet."}
              </h3>
              <p>Check back for the latest additions.</p>
            </div>
          ) : (
            <div
              className={`product-grid ${visibleProducts.length === 1 ? "single-product" : ""}`}
            >
              {visibleProducts.map((product) => (
                <Link className="catalog-tile" href={`/product/${product.slug || product.id}`} key={product.id}><div className="tile-image"><img src={productImage(product)} alt={product.name}/><span className="tile-arrow"><ArrowUpRight size={23}/></span></div><div className="tile-info"><span>{product.isBestSeller ? "FEATURED" : "DIGITAL PRODUCT"}</span><h3>{product.name}</h3><div><p>From <strong>{product.variants.length ? price(Math.min(...product.variants.map(v=>v.cost)),currency) : "Unavailable"}</strong></p><span>View options <ArrowRight size={15}/></span></div></div></Link>
              ))}
            </div>
          )}
        </section>
        <section id="why-remorse" className="section why-section">
          <Reveal>
            <div className="section-heading">
              <span className="section-kicker">A BETTER EXPERIENCE</span>
              <h2>
                Why choose <span>Remorse.</span>
              </h2>
              <p>Less friction. More time for what you came for.</p>
            </div>
          </Reveal>
          <div className="why-grid">
            <div className="feature-main-shell why-panel">
              <article className="feature feature-main">
                <div className="feature-visual" aria-hidden="true">
                  <div className="key-orbit orbit-one" />
                  <div className="key-orbit orbit-two" />
                  <div className="key-core">
                    <Key size={48} weight="light" />
                  </div>
                  <span className="delivery-chip">
                    <CheckCircle size={16} weight="fill" /> DIGITAL DELIVERY
                  </span>
                </div>
                <div className="feature-copy">
                  <h3>Instant access.</h3>
                  <p>
                    Your key is sent immediately after purchase, so you can get
                    set up without waiting.
                  </p>
                </div>
              </article>
            </div>
            <div className="feature-stack">
              <div className="why-panel">
                <article className="feature feature-small">
                  <span className="feature-icon">
                    <Fingerprint size={30} weight="light" />
                  </span>
                  <div>
                    <h3>Built for players.</h3>
                    <p>
                      Every product is chosen for players who want a focused,
                      dependable experience.
                    </p>
                  </div>
                  <ArrowUpRight className="feature-corner" size={20} />
                </article>
              </div>
              <div className="why-panel">
                <article className="feature feature-small">
                  <span className="feature-icon">
                    <Bag size={30} weight="light" />
                  </span>
                  <div>
                    <h3>Trusted by the community.</h3>
                    <p>
                      Read real customer feedback from players before you make
                      your choice.
                    </p>
                  </div>
                  <ArrowUpRight className="feature-corner" size={20} />
                </article>
              </div>
            </div>
          </div>
        </section>
        <Reviews products={products} ready={status === "ready"} unavailable={status === "error"} onSettled={finishReviews} />
        <section className="section faq-section" id="faq">
          <Reveal className="faq-intro">
            <span className="section-kicker">GOOD TO KNOW</span>
            <h2>
              A few questions.
              <br />
              <span>Clear answers.</span>
            </h2>
            <p>Everything you need before making your move.</p>
            <a className="text-button" href="#products">
              Back to the collection <ArrowUpRight size={18} />
            </a>
          </Reveal>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <Reveal key={question}>
                <details className="faq-item" open={index === 0}>
                  <summary>
                    <span>{question}</span>
                    <Plus size={19} />
                  </summary>
                  <p>{answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section final-cta">
          <Reveal>
            <h2>
              Make it <span>Remorse.</span>
            </h2>
            <a className="primary-button" href="#products">
              Find your product <Arrow />
            </a>
          </Reveal>
        </section>
      </>}
      </main>
      <footer className="section footer">
        <div className="footer-top">
          <Brand />
          <p>Your game. Your way.</p>
          <a href={productSlug ? "#product-detail" : "#top"} className="back-top">
            Back to top <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="footer-links">
          <span>© {new Date().getFullYear()} Remorse.dev</span>
          <nav aria-label="Footer navigation">
            <a href="/#products">Products</a>
            <a href="/#reviews">Reviews</a>
            <a href="/#faq">Help & FAQ</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/refunds">Refunds</a>
          </nav>
        </div>
      </footer>
      {checkingOut && (
        <div className="checkout-progress" role="status">
          Opening secure checkout…
        </div>
      )}
      <dialog
        ref={dialog}
        className="cart-drawer"
        onCancel={() => setCartOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const rect = dialog.current!.getBoundingClientRect();
            if (event.clientX < rect.left) setCartOpen(false);
          }
        }}
        aria-labelledby="cart-title"
      >
        <div className="cart-inner">
          <div className="cart-header">
            <div>
              <h2 id="cart-title">
                Your Cart
              </h2>
              <span className="section-kicker">{cartCount} {cartCount === 1 ? "item" : "items"} selected</span>
            </div>
            <button
              className="icon-button"
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
            >
              <X size={22} />
            </button>
          </div>
          <div className="cart-items">
            {!cart.length ? (
              <div className="cart-empty">
                <Bag size={44} weight="light" />
                <h3>A little room for your next move.</h3>
                <p>Your cart is empty.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setCartOpen(false);
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore products <Arrow />
                </button>
              </div>
            ) : (
              cartLines.map(({ item, product, variant }) => (
                <article
                  className="cart-line"
                  key={`${item.productId}-${item.variantId}`}
                >
                  <div className="cart-thumb">
                    {product && productImage(product, variant) ? (
                      <img
                        src={productImage(product, variant)}
                        alt={product.name}
                      />
                    ) : (
                      <span>r.</span>
                    )}
                  </div>
                  <div className="cart-line-copy">
                    <strong>{product?.name || "Unavailable product"}</strong>
                    <span>{variant?.name || "Option unavailable"}</span>
                    <b>
                      {variant
                        ? price(variant.cost * item.quantity, currency)
                        : "Unavailable"}
                    </b>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${product?.name} quantity`}
                        disabled={
                          !variant ||
                          item.quantity <=
                            Math.max(1, variant.minimumQuantity ?? 1)
                        }
                        onClick={() =>
                          variant &&
                          changeQuantity(item, variant, item.quantity - 1)
                        }
                      >
                        <Minus size={12} />
                      </button>
                      <span aria-label="Quantity">{item.quantity}</span>
                      <button
                        aria-label={`Increase ${product?.name} quantity`}
                        disabled={
                          !variant || item.quantity >= maxQuantity(variant)
                        }
                        onClick={() =>
                          variant &&
                          changeQuantity(item, variant, item.quantity + 1)
                        }
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="icon-button remove-button"
                    aria-label={`Remove ${product?.name || "product"}`}
                    onClick={() => remove(item)}
                  >
                    <Trash size={17} />
                  </button>
                </article>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <form
              className="cart-checkout"
              onSubmit={(event) => {
                event.preventDefault();
                checkout();
              }}
            >
              <div className="subtotal">
                <span>Subtotal</span>
                <strong>{price(subtotal, currency)}</strong>
              </div>
              <div className="tax-row"><span>Taxes</span><span>Calculated at checkout</span></div>
              {cartInvalid && (
                <p className="cart-error" role="alert">
                  An item exceeds current stock or is no longer available.
                  Reduce its quantity or remove it to continue.
                </p>
              )}
              <label htmlFor="checkout-email">Your email</label>
              <input
                id="checkout-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {cartMessage && (
                <p className="cart-message" role="status">
                  {cartMessage}
                </p>
              )}
              <div className="checkout-actions">
              <button type="button" className="clear-cart-button" aria-label="Clear cart" onClick={() => { writeStoredCart([]); syncCart([]); setCartMessage("Cart cleared."); }}><Trash size={20} /></button>
              <button
                className="primary-button checkout-button"
                disabled={checkingOut || cartInvalid || maintenance}
                type="submit"
              >
                {checkingOut ? "Opening checkout…" : "Secure checkout"}
                <Arrow />
              </button>
              </div>
              <small>
                <ShieldCheck size={14} /> Secure payment
              </small>
            </form>
          )}
        </div>
      </dialog>
      </div>
    </>
  );
}
