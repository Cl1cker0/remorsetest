import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

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

export default function LegalLayout({
  children,
  title,
  updated,
}: {
  children: React.ReactNode;
  title: string;
  updated: string;
}) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Brand />
        <Link className="legal-back" href="/#top">
          <ArrowLeft size={16} />
          Back to store
        </Link>
      </header>
      <main className="legal-main">
        <article className="legal-article">
          <span className="section-kicker">LEGAL</span>
          <h1>{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
          <div className="legal-body">{children}</div>
          <nav className="legal-nav" aria-label="Legal pages">
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refunds">Refund Policy</Link>
          </nav>
        </article>
      </main>
      <footer className="section footer legal-footer">
        <div className="footer-links">
          <span>© {new Date().getFullYear()} Remorse.dev</span>
          <nav aria-label="Footer navigation">
            <a href="/#products">Products</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/refunds">Refunds</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
