import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern purchases and use of Remorse.dev digital products.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="September 22, 2026">
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to
        and purchase of digital products from Remorse.dev (&ldquo;Remorse,&rdquo;
        &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By placing an
        order through our store, you agree to these Terms. If you do not agree,
        do not purchase or use our products.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Remorse.dev operates an online storefront selling digital software and
        related license keys for gaming use. Checkout, payment processing, and
        order delivery are handled through our storefront provider. Support
        requests should be submitted through the order link in your confirmation
        email or the support channel listed on our site.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old, or the age of legal majority in your
        jurisdiction, to place an order. By purchasing, you represent that you
        meet this requirement and that you have the legal capacity to enter into
        a binding agreement.
      </p>

      <h2>3. Products and licenses</h2>
      <p>
        All products are digital. A purchase grants you a personal,
        non-exclusive, non-transferable license to use the delivered product for
        its intended purpose, for the duration associated with the variant you
        selected (for example, a day, month, or lifetime access term), unless a
        different term is stated on the product page.
      </p>
      <ul>
        <li>
          You may not resell, sublicense, share, publish, or redistribute any
          product, key, file, or update.
        </li>
        <li>
          You may not reverse engineer, decompile, modify, or create derivative
          works except where such restriction is prohibited by law.
        </li>
        <li>
          Access terms (1 Day, 30 Days, Lifetime, etc.) are defined by the
          variant purchased and are enforced by the product itself.
        </li>
        <li>
          One license is for one user unless the product page explicitly states
          otherwise.
        </li>
      </ul>

      <h2>4. Ordering and payment</h2>
      <p>
        All prices are listed in the currency shown on the product page. Orders
        are placed when you complete checkout. We may decline or cancel an order
        for reasons including pricing errors, suspected fraud, payment failure,
        stock limits, or violation of these Terms. If payment has already been
        captured for a cancelled order, we will refund it to the original
        payment method.
      </p>
      <p>
        Coupons, discounts, and promotional pricing apply only as configured at
        the time of purchase and cannot be combined unless expressly allowed.
      </p>

      <h2>5. Delivery</h2>
      <p>
        Products are delivered digitally after payment confirmation — typically
        license keys, download links, or access details, depending on the
        product. You are responsible for providing a valid email address and for
        securing your order confirmation. If delivery fails due to incorrect
        contact details on your part, contact support with your order ID.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use products in violation of any applicable law or third-party rights.</li>
        <li>Circumvent license checks, usage limits, or access periods.</li>
        <li>Share accounts, keys, or downloads with third parties.</li>
        <li>
          Resell, trade, or publish products on any marketplace, forum, or
          channel without our written permission.
        </li>
        <li>
          Interfere with the store, checkout, or delivery systems, including
          abusive support contact or chargeback fraud.
        </li>
      </ul>

      <h2>7. Third-party services</h2>
      <p>
        Payments and hosted checkout are provided by third-party processors and
        storefront infrastructure. Your payment data is handled by those
        providers under their own terms and privacy policies. We do not store
        full card numbers on our own systems.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        Products are provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo;
        To the maximum extent permitted by law, we disclaim all warranties,
        express or implied, including merchantability, fitness for a particular
        purpose, and non-infringement. We do not guarantee uninterrupted,
        error-free, or risk-free operation of any product, or that a product
        will meet every requirement you have. Compatibility can change with
        game, platform, or software updates that are outside our control.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Remorse.dev and its operators
        shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or any loss of data, profits,
        goodwill, or access arising from your purchase or use of the products.
        Our total aggregate liability for any claim relating to an order shall
        not exceed the amount you paid for that order.
      </p>

      <h2>10. Refunds</h2>
      <p>
        All purchases are final. Refunds are issued only where a verified defect
        in the product is confirmed under our{" "}
        <a href="/refunds">Refund Policy</a>. Filing a payment dispute without
        contacting us first may result in account and order restrictions while
        the matter is reviewed.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or terminate access to products if you breach these
        Terms, including unauthorized sharing or redistribution. Suspension does
        not entitle you to a refund except where required by law or where the
        Refund Policy applies.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last
        updated&rdquo; date reflects the latest revision. Continued purchase
        after changes take effect constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms should be sent through the support channel on
        your order confirmation, or via our store contact points. Include your
        order ID so we can find your purchase quickly.
      </p>
    </LegalLayout>
  );
}
