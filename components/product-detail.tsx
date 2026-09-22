"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOut,
  Bag,
  CaretLeft,
  CaretRight,
  Check,
  Key,
  Minus,
  Plus,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import {
  firstAvailableVariant,
  imageUrl,
  isVariantAvailable,
  maxQuantity,
  price,
  type Product,
  type Variant,
} from "@/lib/sellauth";

type ProductDetailProps = {
  product: Product;
  currency: string;
  add: (p: Product, v: Variant, q?: number) => void;
  maintenance: boolean;
};

export default function ProductDetail({
  product,
  currency,
  add,
  maintenance,
}: ProductDetailProps) {
  const variants = [...product.variants].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );
  const [selected, setSelected] = useState(firstAvailableVariant(variants)?.id);
  const [index, setIndex] = useState(0);
  const variant =
    variants.find((v) => v.id === selected) || firstAvailableVariant(variants);
  const [quantity, setQuantity] = useState(
    Math.max(1, variant?.minimumQuantity || 1),
  );
  const [failed, setFailed] = useState(false);
  const lightbox = useRef<HTMLDialogElement>(null);

  const images = [
    ...new Set([...(variant?.imageNames || []), ...(product.imageNames || [])]),
  ];
  const available = variant ? isVariantAvailable(variant) : false;
  const description =
    product.description?.replace(/\[cite:\s*[\d,\s]+\]/gi, "").trim() || "";

  function changeImage(next: number) {
    setIndex((next + images.length) % images.length);
    setFailed(false);
  }

  function selectVariant(v: Variant) {
    if (!isVariantAvailable(v)) return;
    setSelected(v.id);
    setQuantity(Math.max(1, v.minimumQuantity || 1));
    setIndex(0);
    setFailed(false);
  }

  return (
    <section className="section detail-section">
      <Link href="/#products" className="detail-back">
        <ArrowLeft size={17} />
        All products
      </Link>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="cinema-bezel">
            <div className="detail-main-image">
              <div className="gallery-toolbar">
                <span>PRODUCT GALLERY</span>
                {images.length > 0 && (
                  <button
                    className="gallery-expand"
                    aria-label="Expand image"
                    onClick={() => lightbox.current?.showModal()}
                  >
                    <ArrowsOut size={16} />
                    Expand
                  </button>
                )}
              </div>

              {images.length && !failed ? (
                <img
                  src={imageUrl(images[index] || images[0])}
                  alt={`${product.name} - image ${index + 1}`}
                  onError={() => setFailed(true)}
                />
              ) : (
                <div className="image-unavailable">Image unavailable</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    className="gallery-prev"
                    aria-label="Previous image"
                    onClick={() => changeImage(index - 1)}
                  >
                    <CaretLeft />
                  </button>
                  <button
                    className="gallery-next"
                    aria-label="Next image"
                    onClick={() => changeImage(index + 1)}
                  >
                    <CaretRight />
                  </button>
                  <span className="gallery-count">
                    {index + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((name, i) => (
                <button
                  key={name}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === index}
                  onClick={() => changeImage(i)}
                >
                  <img src={imageUrl(name)} alt="" />
                </button>
              ))}
            </div>
          )}

          <div className="delivery-journey">
            <span className="section-kicker">AFTER PURCHASE</span>
            <h3>From checkout to access.</h3>
            <ol>
              <li>
                <Bag size={19} />
                <strong>Checkout</strong>
                <span>Choose your payment</span>
              </li>
              <li>
                <Check size={19} />
                <strong>Confirmation</strong>
                <span>Payment confirmed</span>
              </li>
              <li>
                <Key size={19} />
                <strong>Delivery</strong>
                <span>Access your order</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Info */}
        <div className="detail-info">
          <h1>{product.name}</h1>

          <div className="selected-price">
            <div>
              <small>SELECTED PRICE</small>
              <strong>
                {variant ? price(variant.cost * quantity, currency) : "Unavailable"}
              </strong>
            </div>
            <div>
              <b>{variant?.name}</b>
              <small>{available ? `${quantity} selected` : "Out of stock"}</small>
            </div>
          </div>

          <h2 className="option-heading">Choose your access</h2>

          <div className="plan-options" role="group" aria-label="Product variants">
            {variants.map((v) => {
              const inStock = isVariantAvailable(v);
              return (
                <button
                  key={v.id}
                  className={`plan-option${inStock ? "" : " is-out-of-stock"}`}
                  aria-pressed={variant?.id === v.id}
                  disabled={!inStock}
                  onClick={() => selectVariant(v)}
                >
                  <span className="plan-radio">
                    {variant?.id === v.id && <Check size={13} />}
                  </span>

                  <span className="plan-option-label">
                    {v.name}
                    <small>Digital license</small>
                  </span>

                  {!inStock && (
                    <em className="oos-badge">Out of stock</em>
                  )}

                  <strong>{price(v.cost, currency)}</strong>
                </button>
              );
            })}
          </div>

          <div className="detail-total">
            <span className="quantity-label">Quantity</span>
            <div className="quantity-control">
              <button
                aria-label="Decrease quantity"
                disabled={
                  !variant ||
                  quantity <= Math.max(1, variant.minimumQuantity || 1)
                }
                onClick={() => setQuantity((q) => q - 1)}
              >
                <Minus size={14} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                disabled={!variant || quantity >= maxQuantity(variant)}
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            className="primary-button detail-add"
            disabled={!available || maintenance}
            onClick={() => variant && add(product, variant, quantity)}
          >
            <Bag size={19} />
            {available ? "Add to cart" : "Out of stock"}
            <span className="button-icon">
              {available ? <ArrowRight size={19} /> : null}
            </span>
          </button>

          <p className="purchase-note">
            Payment options and any applicable taxes appear at checkout.
          </p>
        </div>
      </div>

      {description && (
        <section
          className="product-description-section"
          aria-labelledby="product-description-title"
        >
          <header className="product-description-header">
            <h2 id="product-description-title">Product details</h2>
            <p>The complete breakdown, directly from the product listing.</p>
          </header>
          <article className="product-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description}
            </ReactMarkdown>
          </article>
        </section>
      )}

      <dialog ref={lightbox} className="gallery-lightbox" aria-label="Product image gallery">
        <button
          className="icon-button lightbox-close"
          aria-label="Close gallery"
          onClick={() => lightbox.current?.close()}
        >
          <X size={24} />
        </button>
        {images.length > 0 && (
          <img
            src={imageUrl(images[index] || images[0])}
            alt={`${product.name} - image ${index + 1}`}
          />
        )}
        {images.length > 1 && (
          <>
            <button
              className="gallery-prev"
              aria-label="Previous expanded image"
              onClick={() => changeImage(index - 1)}
            >
              <CaretLeft />
            </button>
            <button
              className="gallery-next"
              aria-label="Next expanded image"
              onClick={() => changeImage(index + 1)}
            >
              <CaretRight />
            </button>
          </>
        )}
      </dialog>
    </section>
  );
}
