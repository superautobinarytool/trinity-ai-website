import LegalLayout, { LegalSection } from "@/components/layout/LegalLayout";

export default function RefundPolicy() {
  return (
    <LegalLayout title="Refund Policy" lastUpdated="March 20, 2026">

      <LegalSection title="Our Commitment">
        <p>
          We stand behind Trinity Trading AI and want you to feel confident in your purchase.
          If you are not satisfied within your first 30 days, we will issue a full refund — no
          complicated procedures, no questions asked beyond basic verification.
        </p>
      </LegalSection>

      <LegalSection title="1. Money-Back Guarantee">
        <p>
          You are eligible for a full refund if you request it within{" "}
          <span className="text-white font-semibold">30 calendar days</span> of your original
          purchase date. "Purchase date" means the date on which your payment was confirmed
          on-chain and your licence key was issued.
        </p>
      </LegalSection>

      <LegalSection title="2. How to Request a Refund">
        <p>To request a refund within the eligible window, contact us through either of the
          following channels and include your order reference (found in your licence delivery email):
        </p>
        <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
          <li>
            <span className="text-white font-medium">Telegram —</span>{" "}
            <a
              href="https://t.me/tti_mark_support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors"
            >
              t.me/tti_mark_support
            </a>
          </li>
          <li>
            <span className="text-white font-medium">Email —</span>{" "}
            <a
              href="mailto:support@trinitytradingai.com"
              className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors"
            >
              support@trinitytradingai.com
            </a>
          </li>
        </ul>
        <p className="mt-2">
          Please include: your full name, the email address used at checkout, your order
          reference number, and a brief reason for the refund (optional — we use this only to
          improve the product).
        </p>
      </LegalSection>

      <LegalSection title="3. What Happens After You Request">
        <ol className="list-decimal list-outside ml-5 space-y-2 mt-2">
          <li>
            <span className="text-white font-medium">Verification (within 24 hours) —</span> We
            verify your order details and confirm eligibility.
          </li>
          <li>
            <span className="text-white font-medium">Licence revocation (within 24 hours) —</span>{" "}
            Your licence key is deactivated immediately upon approval of the refund.
          </li>
          <li>
            <span className="text-white font-medium">Refund processing (3–10 business days) —</span>{" "}
            Cryptocurrency refunds are sent to the wallet address you used for the original
            payment, at the prevailing exchange rate on the day of refund processing. Processing
            time depends on network congestion and your wallet provider.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="4. Renewal Subscriptions">
        <p>
          The 30-day money-back guarantee applies to your{" "}
          <span className="text-white font-medium">first purchase only</span>. Monthly renewal
          payments are non-refundable once processed. If you do not wish to renew, you must cancel
          your subscription before the renewal date by contacting support at least 24 hours in
          advance.
        </p>
      </LegalSection>

      <LegalSection title="5. Exceptions — When Refunds Are Not Issued">
        <p>Refunds will not be granted in the following circumstances:</p>
        <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
          <li>The refund request is made after the 30-calendar-day window has elapsed.</li>
          <li>
            You have violated the Terms of Use, including sharing your licence key, reverse
            engineering the software, or using it for fraudulent or illegal activity.
          </li>
          <li>
            The request relates to losses incurred from trading decisions made using Trinity's
            signals. Trading losses are not covered under this policy — please trade responsibly
            and only with capital you can afford to lose.
          </li>
          <li>
            You have already been issued a refund on a previous Trinity subscription.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Chargebacks">
        <p>
          We ask that you contact us directly before initiating a chargeback or payment dispute
          with your wallet provider or exchange. We are committed to resolving issues quickly
          and fairly. Unjustified chargebacks may result in permanent account suspension and
          licence termination.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact Us">
        <p>
          If you have any questions about this Refund Policy or the status of a refund request,
          please reach out via Telegram at{" "}
          <a
            href="https://t.me/tti_mark_support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors"
          >
            t.me/tti_mark_support
          </a>{" "}
          or by email at{" "}
          <a
            href="mailto:support@trinitytradingai.com"
            className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors"
          >
            support@trinitytradingai.com
          </a>
          .
        </p>
      </LegalSection>

    </LegalLayout>
  );
}
