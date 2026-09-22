import type { Metadata } from "next";
import LegalLayout from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Remorse.dev refund policy: all sales final, defective products investigated and compensated.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" updated="September 22, 2026">
      <p className="legal-highlight">
        All purchases are final. If there is a defect with the product, it will
        be investigated and compensated.
      </p>

      <h2>1. General rule — final sale</h2>
      <p>
        Digital products on Remorse.dev are delivered immediately and are
        considered final upon successful payment. Because of the nature of
        digital goods, we do not offer refunds for:
      </p>
      <ul>
        <li>Change of mind or accidental purchase of the wrong variant.</li>
        <li>
          Compatibility issues that were disclosed or reasonably foreseeable
          (for example system or game version requirements stated on the product
          page).
        </li>
        <li>
          Failure to use, download, or redeem a delivered product after delivery
          was completed.
        </li>
        <li>
          Account restrictions resulting from your own violation of our Terms
          (sharing, redistribution, abuse).
        </li>
        <li>
          Price drops, promotions after your purchase, or dissatisfaction with
          results that are not caused by a product defect.
        </li>
      </ul>

      <h2>2. Defective products</h2>
      <p>
        If a product is defective — it does not work as described, the delivered
        key or file is invalid, or the product fails for reasons attributable to
        the product itself rather than your environment or configuration — we
        will investigate the issue and, where the defect is confirmed, compensate
        you.
      </p>
      <p>Possible outcomes of a confirmed defect include:</p>
      <ul>
        <li>Replacement delivery (new key, corrected file, or re-issue).</li>
        <li>Repair or a fix/update that resolves the defect.</li>
        <li>Partial or full refund, or store credit, at our discretion.</li>
        <li>Extension of access time where the defect cut your paid term short.</li>
      </ul>
      <p>
        The specific remedy depends on the product, the nature of the defect, and
        what makes you whole. Compensation is not automatic for every complaint —
        it follows a good-faith investigation.
      </p>

      <h2>3. How to request an investigation</h2>
      <p>Contact support using the order link in your confirmation email and include:</p>
      <ul>
        <li>Your order ID / invoice number.</li>
        <li>The email address used at checkout.</li>
        <li>Which product and variant you purchased.</li>
        <li>
          A clear description of the defect, plus any error messages, screenshots,
          or steps that reproduce the problem.
        </li>
      </ul>
      <p>
        Incomplete reports slow things down. The more detail you give us, the
        faster we can verify (or rule out) a defect.
      </p>

      <h2>4. Investigation timeline</h2>
      <p>
        We aim to acknowledge defect reports promptly and to complete
        investigations within a reasonable period — typically a few business
        days, depending on complexity and how quickly we can reproduce the issue.
        Some defects require coordination with builds or environments and may take
        longer. We will keep you updated on status.
      </p>

      <h2>5. What is not a defect</h2>
      <p>The following are not treated as product defects:</p>
      <ul>
        <li>
          Downtime, bans, patches, or updates on third-party platforms (game
          servers, operating systems, anti-cheat) outside our control — though we
          will still try to restore compatibility when reasonable.
        </li>
        <li>Performance variations due to your hardware, network, or setup.</li>
        <li>
          Detection or action taken by third-party services where the product
          page did not guarantee immunity.
        </li>
        <li>Running a paid access term to completion without issues.</li>
      </ul>

      <h2>6. Chargebacks and payment disputes</h2>
      <p>
        Please contact us before filing a chargeback or payment dispute. Most
        issues — including genuine defects — are resolved faster when handled
        directly. Opening a dispute without contacting us first may result in
        temporary restrictions on future orders while the dispute is active. If a
        chargeback is filed and later withdrawn or decided in our favor, we may
        restore access accordingly.
      </p>

      <h2>7. Abusive or fraudulent claims</h2>
      <p>
        We reserve the right to refuse compensation where a claim is fraudulent,
        manipulated (for example altered screenshots or false reproduction
        steps), or part of a pattern of abuse. Abuse of the refund or defect
        process may result in termination of access under our Terms.
      </p>

      <h2>8. Legal rights</h2>
      <p>
        Nothing in this policy limits any non-waivable consumer rights you have
        under applicable law. Where the law grants you mandatory remedies, those
        rights apply in addition to — not instead of — this policy.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may revise this Refund Policy from time to time. The &ldquo;Last
        updated&rdquo; date reflects the current version. Changes apply to
        purchases made after the revised policy is posted unless law requires
        otherwise.
      </p>

      <h2>10. Contact</h2>
      <p>
        Defect reports and refund questions go through the support channel on
        your order confirmation. Include your order ID so we can pull the invoice
        and start the investigation.
      </p>
    </LegalLayout>
  );
}
