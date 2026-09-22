import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Remorse.dev collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="September 22, 2026">
      <p>
        This Privacy Policy explains how Remorse.dev (&ldquo;Remorse,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) handles
        information when you visit our store, place an order, or contact
        support. By using the site, you acknowledge the practices described
        here.
      </p>

      <h2>1. Information we collect</h2>
      <p>We collect information in three broad ways:</p>
      <ul>
        <li>
          <strong>Information you provide</strong> — your email address at
          checkout, support messages, order-related details you send us, and any
          product custom fields a listing asks for (for example a Discord
          username).
        </li>
        <li>
          <strong>Order and transaction information</strong> — products
          purchased, variant, price, currency, invoice status, coupon usage, and
          timestamps. Payment card numbers are processed by our payment
          providers; we receive confirmation and limited payment metadata, not
          your full card details.
        </li>
        <li>
          <strong>Technical and usage data</strong> — IP address, browser type,
          device information, pages viewed, referrer, approximate location derived
          from IP, and similar log data collected automatically when you load
          the site.
        </li>
      </ul>

      <h2>2. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Process orders, deliver products, and send transactional emails.</li>
        <li>Provide customer support and resolve disputes or defect claims.</li>
        <li>Detect fraud, abuse, chargebacks, and violations of our Terms.</li>
        <li>Operate, maintain, and improve the store and product experience.</li>
        <li>Comply with legal obligations and enforce our agreements.</li>
      </ul>
      <p>
        We do not sell your personal information. We do not use your data for
        unrelated third-party advertising networks.
      </p>

      <h2>3. Payment processing</h2>
      <p>
        Payments are handled by third-party processors (for example PayPal,
        card processors, and cryptocurrency providers shown at checkout). When
        you pay, your payment information goes directly to those providers under
        their privacy policies. We receive payment confirmation and the
        information needed to fulfill your order.
      </p>

      <h2>4. Cookies and similar technologies</h2>
      <p>
        The site and checkout may use cookies, localStorage, or similar
        technologies to keep your cart working, remember affiliate or campaign
        attribution, maintain sessions, and understand basic traffic. Where
        required by law, non-essential cookies run only after consent presented
        by the storefront. You can control cookies through your browser settings;
        blocking essential cookies may break cart or checkout functionality.
      </p>

      <h2>5. Sharing of information</h2>
      <p>We share information only with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> — hosting, checkout, payment,
          email delivery, analytics, and support tooling that process data on
          our behalf.
        </li>
        <li>
          <strong>Legal and safety</strong> — when required by law, subpoena, or
          to protect the rights, property, or safety of Remorse, our customers,
          or others.
        </li>
        <li>
          <strong>Business transfers</strong> — in connection with a merger,
          acquisition, or sale of assets, subject to normal confidentiality
          expectations.
        </li>
      </ul>

      <h2>6. Retention</h2>
      <p>
        We keep order and invoice records for as long as needed for accounting,
        fraud prevention, support, and legal compliance. Support correspondence is
        kept while relevant to an open or recent matter. You can request deletion
        of data we no longer need to retain (see Your rights below), but we may
        keep records we are legally required to maintain.
      </p>

      <h2>7. Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect
        information — including HTTPS transport, access controls, and reliance
        on established payment providers for card data. No method of transmission
        or storage is perfectly secure, and we cannot guarantee absolute security.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Our providers may process information in countries other than your own.
        By using the store, you understand that information may be transferred
        to jurisdictions with different data protection rules than yours. Where
        required, appropriate safeguards are used by our providers.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or export your personal data, to object to or restrict certain
        processing, and to withdraw consent where processing is based on consent.
        To exercise these rights, contact us using the support channel on your
        order confirmation with the email used at checkout. We may need to verify
        your identity before fulfilling a request.
      </p>

      <h2>10. Children</h2>
      <p>
        The store is not directed at children under 16 (or the applicable age of
        digital consent). We do not knowingly collect personal information from
        children. If you believe a child has provided information to us, contact
        us and we will delete it.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy occasionally. The &ldquo;Last
        updated&rdquo; date shows when it was most recently revised. Material
        changes will be reflected on this page.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy questions can be sent through the support channel referenced in
        your order confirmation email. Include the email address used at checkout
        so we can locate your records.
      </p>
    </LegalLayout>
  );
}
