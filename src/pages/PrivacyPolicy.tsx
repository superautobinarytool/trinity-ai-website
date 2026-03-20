import LegalLayout, { LegalSection } from "@/components/layout/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="March 20, 2026">

      <LegalSection title="1. Introduction">
        <p>
          Project Trinity ("Trinity", "we", "us", or "our") operates the Trinity Trading AI software
          and website at trinitytradingai.com (the "Service"). This Privacy Policy explains what
          personal information we collect, how we use it, and the choices you have. By using the
          Service you agree to the collection and use of information in accordance with this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect the following categories of information when you use our Service:</p>
        <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
          <li>
            <span className="text-white font-medium">Account &amp; Order Data —</span> your full
            name, email address, chosen plan, coupon code (if any), and a unique order reference
            generated at checkout.
          </li>
          <li>
            <span className="text-white font-medium">Payment Data —</span> cryptocurrency payment
            references and on-chain transaction identifiers provided by our payment processor,
            NOWPayments. We do not store card numbers or private wallet keys.
          </li>
          <li>
            <span className="text-white font-medium">Usage &amp; Technical Data —</span> IP address,
            browser type, operating system, pages visited, and timestamps, collected automatically
            via server logs and cookies.
          </li>
          <li>
            <span className="text-white font-medium">Communications —</span> any messages you send
            us via email or Telegram support.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
          <li>Process your order and deliver your software licence key by email.</li>
          <li>Send transactional emails (order confirmation, licence delivery, support replies).</li>
          <li>Maintain records required for fraud prevention and financial compliance.</li>
          <li>Improve and troubleshoot the Service.</li>
          <li>Respond to support enquiries.</li>
        </ul>
        <p className="mt-2">
          We do not use your data for marketing without your explicit consent and we never sell
          your personal information to third parties.
        </p>
      </LegalSection>

      <LegalSection title="4. Third-Party Service Providers">
        <p>
          We share personal data with the following processors strictly to deliver the Service:
        </p>
        <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
          <li>
            <span className="text-white font-medium">NOWPayments (nowpayments.io) —</span> processes
            cryptocurrency payments. Your payment data is subject to their privacy policy.
          </li>
          <li>
            <span className="text-white font-medium">Supabase —</span> stores order records, licence
            keys, and coupon data in encrypted databases hosted on Supabase-managed infrastructure.
          </li>
          <li>
            <span className="text-white font-medium">Resend —</span> delivers transactional emails
            including your licence key. Only your name, email address, and order details are
            shared.
          </li>
          <li>
            <span className="text-white font-medium">Vercel —</span> hosts our website and serverless
            API functions. Request data including IP addresses may be logged by Vercel.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Retention">
        <p>
          We retain order and licence records for a minimum of 12 months following your last
          active subscription period, and for as long as required by applicable law (e.g. financial
          record-keeping obligations). You may request deletion of your personal data at any time
          by contacting us; we will comply within 30 days subject to any legal retention
          requirements.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>
          Depending on your jurisdiction you may have the right to: access the personal data we
          hold about you; correct inaccurate data; request deletion; object to or restrict
          processing; and data portability. To exercise any right, contact us at the address below.
          We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          All data is transmitted over TLS (HTTPS). Data stored in Supabase is encrypted at rest.
          Licence keys and order records are accessible only via server-side API calls authenticated
          with a service-role key that is never exposed to the client. Despite these measures, no
          transmission over the internet is 100% secure; we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Our website uses minimal, technically-necessary cookies (e.g. session state). We do not
          use advertising or cross-site tracking cookies. You may configure your browser to refuse
          cookies, but some parts of the Service may not function correctly.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          The Service is not directed at children under the age of 18. We do not knowingly collect
          personal information from minors. If you believe we have inadvertently collected such
          data, contact us and we will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically. When we do, we will update the "Last
          updated" date above. Continued use of the Service after changes are posted constitutes
          your acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          For privacy-related enquiries or to exercise your data rights, contact us via Telegram at{" "}
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
