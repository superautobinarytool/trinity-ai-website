import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// ── Types ──────────────────────────────────────────────────────────────────
export interface LicenseEmailPayload {
  to: string;
  customerName: string;
  plan: "starter" | "pro" | "starter-annual" | "pro-annual";
  licenseKey: string;
  orderId: string;
  expiryDate: string; // human-readable, e.g. "April 19, 2026"
}

// ── Sender config ──────────────────────────────────────────────────────────
// Update EMAIL_FROM once you've verified a custom domain in Resend.
// For first-time testing use: onboarding@resend.dev  (sends to account owner only)
const EMAIL_FROM    = process.env.EMAIL_FROM ?? "Trinity Trading <noreply@trinitytradingai.com>";
const EMAIL_REPLY   = process.env.EMAIL_REPLY_TO ?? "support@trinitytradingai.com";

// ── Helpers ────────────────────────────────────────────────────────────
function getPlanLabel(plan: string): string {
  switch (plan) {
    case "pro":             return "Pro";
    case "starter-annual": return "Starter Annual";
    case "pro-annual":     return "Pro Annual";
    default:               return "Starter";
  }
}

// ── Public API ────────────────────────────────────────────────────────
export async function sendLicenseEmail(payload: LicenseEmailPayload): Promise<void> {
  const planLabel   = getPlanLabel(payload.plan);
  const isAnnual    = payload.plan.endsWith("-annual");
  const billingDesc = isAnnual ? "Annual" : "Monthly";

  const { error } = await resend.emails.send({
    from:    EMAIL_FROM,
    replyTo: EMAIL_REPLY,
    to:      payload.to,
    subject: `🔑 Your Trinity ${planLabel} License – ${billingDesc} Subscription`,
    html:    buildHtml(payload),
    text:    buildPlainText(payload),
  });

  if (error) {
    throw new Error(`[email] Resend error: ${error.message}`);
  }
}

// ── HTML template ───────────────────────────────────────────────────────────
function buildHtml(p: LicenseEmailPayload): string {
  const planLabel   = getPlanLabel(p.plan);
  const isAnnual    = p.plan.endsWith("-annual");
  const billingDesc = isAnnual ? "Annual" : "Monthly";
  const validFor    = isAnnual ? "1 year" : "30 days";
  const firstName   = p.customerName.split(" ")[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Trinity ${planLabel} License Key</title>
</head>
<body style="margin:0;padding:0;background-color:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050508;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background-color:#0c0c10;border-radius:20px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">

          <!-- Green top accent bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#22C55E,#16A34A);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Logo wordmark -->
                    <span style="font-size:18px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">
                      TRINITY
                    </span>
                    <span style="font-size:18px;font-weight:400;color:#22C55E;margin-left:4px;">TRADING</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);
                                 color:#22C55E;font-size:11px;font-weight:700;letter-spacing:0.08em;
                                 padding:4px 10px;border-radius:100px;text-transform:uppercase;">
                      ${planLabel} &middot; ${billingDesc}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">

              <!-- Greeting -->
              <p style="margin:0 0 6px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">
                Welcome aboard, ${escapeHtml(firstName)}!
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#9ca3af;line-height:1.6;">
                Your payment has been confirmed. Here is your Trinity ${planLabel} license key — 
                keep it somewhere safe.
              </p>

              <!-- License key box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:rgba(34,197,94,0.06);border:1.5px solid rgba(34,197,94,0.25);
                            border-radius:14px;margin-bottom:32px;">
                <tr>
                  <td style="padding:8px 20px 4px;">
                    <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.14em;
                               color:#4ade80;text-transform:uppercase;">
                      License Key
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 20px 20px;">
                    <p style="margin:0;font-family:'Courier New',Courier,monospace;
                               font-size:26px;font-weight:700;letter-spacing:0.12em;
                               color:#ffffff;word-break:break-all;">
                      ${escapeHtml(p.licenseKey)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0;font-size:12px;color:#6b7280;">
                      Valid until <strong style="color:#9ca3af;">${escapeHtml(p.expiryDate)}</strong>
                      <span style="color:#4b5563;margin-left:6px;">(${validFor})</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.12em;
                         color:#4b5563;text-transform:uppercase;">
                How to activate
              </p>

              ${[
                ["1", "Download Trinity AI Trading Tool", "Get the latest build at <a href=\"https://trinitytradingai.com/download\" style=\"color:#22C55E;text-decoration:none;font-weight:600;\">trinitytradingai.com/download</a> — your license key activates the software on first launch."],
                ["2", "Launch &amp; enter your key", "Open Trinity, click <strong style=\"color:#e5e7eb;\">Activate License</strong>, and paste the key above."],
                ["3", "Connect your broker", "Follow the setup wizard to link your broker account via the Trinity AI interface."],
                ["4", "Join our Telegram Community", "Connect with our trading community and get onboarding support at <a href=\"https://t.me/trinitytradingai\" style=\"color:#22C55E;text-decoration:none;font-weight:600;\">t.me/trinitytradingai</a>."],
              ].map(([num, title, body]) => `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td width="36" valign="top" style="padding-top:1px;">
                    <span style="display:inline-block;width:24px;height:24px;border-radius:50%;
                                 background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);
                                 text-align:center;line-height:24px;font-size:11px;font-weight:700;
                                 color:#22C55E;">
                      ${num}
                    </span>
                  </td>
                  <td valign="top">
                    <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#e5e7eb;">${title}</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">${body}</p>
                  </td>
                </tr>
              </table>`).join("")}

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="https://t.me/trinitytradingai"
                       style="display:inline-block;padding:14px 32px;
                              background:linear-gradient(135deg,#22C55E,#16A34A);
                              color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;
                              border-radius:12px;letter-spacing:0.02em;
                              box-shadow:0 4px 24px rgba(34,197,94,0.35);">
                      Join our Telegram →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;color:#374151;">
                      Order reference: <span style="font-family:'Courier New',monospace;color:#4b5563;">${escapeHtml(p.orderId)}</span>
                    </p>
                    <p style="margin:0;font-size:11px;color:#374151;line-height:1.5;">
                      Didn't receive your key or need help?
                      <a href="https://t.me/tti_mark_support"
                         style="color:#22C55E;text-decoration:none;">Message us on Telegram</a>
                      with your order reference and we'll resolve it immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ── Plain-text fallback ──────────────────────────────────────────────────────
function buildPlainText(p: LicenseEmailPayload): string {
  const planLabel   = getPlanLabel(p.plan);
  const isAnnual    = p.plan.endsWith("-annual");
  const billingDesc = isAnnual ? "Annual" : "Monthly";
  const validFor    = isAnnual ? "1 year" : "30 days";
  return `
TRINITY TRADING — Your ${planLabel} License Key (${billingDesc})
${"=".repeat(52)}

Hi ${p.customerName},

Your payment has been confirmed. Here is your license key:

  ${p.licenseKey}

Valid until: ${p.expiryDate} (${validFor})
Billing type: ${billingDesc} subscription

HOW TO ACTIVATE
---------------
1. Download Trinity AI Trading Tool from: https://trinitytradingai.com/download
2. Open Trinity → Activate License → paste the key above.
3. Connect your broker via the Trinity AI setup wizard.
4. Join our Telegram community: https://t.me/trinitytradingai

Order reference: ${p.orderId}

Didn't receive your key or need help?
Message us on Telegram: https://t.me/tti_mark_support

— The Trinity Trading Team
`.trim();
}

// ── Utility ──────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
