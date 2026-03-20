import { useState, FormEvent, useId, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import logoWhite from "@/assets/logo-long-white.png";
import {
  LockClosedIcon,
  CheckCircleFilledIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  TagIcon,
} from "@/components/ui/Icons";

/* ─────────────────────────────────────────────────────────────────────────────
   PLAN DEFINITIONS
   Mirrors the data in PricingSection so the checkout is always in sync.
   ───────────────────────────────────────────────────────────────────────────── */
type PlanId = "starter" | "pro" | "starter-annual" | "pro-annual";

const PLANS = {
  starter: {
    id: "starter" as PlanId,
    name: "Starter",
    price: 99,
    renewalPrice: 99,
    badge: "Most Accessible",
    accentColor: "#22C55E",
    period: "mo",
    renewalNote: "Renews at $99.00/mo after your first month. Cancel anytime — no fees, no questions.",
    features: [
      "Trinity software license (Windows 10/11)",
      "Trinity AI signal auto-execution to your broker",
      "Live TradingView charts — 25+ pairs",
      "Smart Compounding profit strategy",
      "Real-time session profit graph",
      "Full trade history & analytics",
      "30-day money-back guarantee",
    ],
  },
  "starter-annual": {
    id: "starter-annual" as PlanId,
    name: "Starter — Annual",
    price: 599,
    renewalPrice: 599,
    badge: "Best Value · 6 Months FREE",
    accentColor: "#22C55E",
    period: "yr",
    renewalNote: "Renews at $599.00/yr after your first year. Cancel anytime — no fees, no questions.",
    features: [
      "Trinity software license (Windows 10/11)",
      "Trinity AI signal auto-execution to your broker",
      "Live TradingView charts — 25+ pairs",
      "Smart Compounding profit strategy",
      "Real-time session profit graph",
      "Full trade history & analytics",
      "6 months FREE vs monthly billing",
      "30-day money-back guarantee",
    ],
  },
  pro: {
    id: "pro" as PlanId,
    name: "Pro",
    price: 199,
    renewalPrice: 199,
    badge: "Best Results",
    accentColor: "#22C55E",
    period: "mo",
    renewalNote: "Renews at $199.00/mo after your first month. Cancel anytime — no fees, no questions.",
    features: [
      "Everything in Starter",
      "Advanced AI compound scaling mode",
      "Priority signal feed",
      "1-on-1 onboarding & setup call",
      "Advanced session configuration",
      "Exclusive pro-only settings",
      "Early access to every new feature",
      "30-day money-back guarantee",
    ],
  },
  "pro-annual": {
    id: "pro-annual" as PlanId,
    name: "Pro — Annual",
    price: 899,
    renewalPrice: 899,
    badge: "Ultimate Value · 7 Months FREE",
    accentColor: "#22C55E",
    period: "yr",
    renewalNote: "Renews at $899.00/yr after your first year. Cancel anytime — no fees, no questions.",
    features: [
      "Everything in Pro monthly",
      "Advanced AI compound scaling mode",
      "Priority signal feed",
      "1-on-1 onboarding & setup call",
      "Advanced session configuration",
      "Exclusive pro-only settings",
      "Early access to every new feature",
      "7 months FREE vs monthly billing",
      "30-day money-back guarantee",
    ],
  },
} as const;

/* Coupon shape returned by /api/payments/validate-coupon */
type CouponDef = { label: string; type: "percent"; value: number };

/* ─────────────────────────────────────────────────────────────────────────────
   NOWPAYMENTS — LIVE INTEGRATION
   The frontend calls our serverless endpoint (/api/payments/create-invoice).
   The server validates the coupon against the DB, recalculates the price
   independently (never trusting the client), then creates the NOWPayments
   invoice and returns { invoice_url } to redirect the user to.
   ───────────────────────────────────────────────────────────────────────────── */
interface OrderPayload {
  name:    string;
  email:   string;
  plan:    PlanId;
  coupon:  string | null;
  orderId: string; // unique reference e.g. TRINITY-1718910000000-AB12CD
  // Note: amount is NOT sent — server recalculates from DB to prevent tampering
}

async function initiateNOWPayment(order: OrderPayload): Promise<string> {
  const res = await fetch("/api/payments/create-invoice", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(order),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ??
      "Payment gateway error. Please try again or contact support."
    );
  }

  const { invoice_url } = data as { invoice_url: string };
  if (!invoice_url) throw new Error("No payment URL returned. Please try again.");
  return invoice_url;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CRYPTO METHOD ICONS  (displayed below the form as accepted payment methods)
   ───────────────────────────────────────────────────────────────────────────── */
const CRYPTO_METHODS = [
  { symbol: "BTC",  color: "#F7931A", title: "Bitcoin"   },
  { symbol: "ETH",  color: "#627EEA", title: "Ethereum"  },
  { symbol: "USDT", color: "#26A17B", title: "Tether"    },
  { symbol: "USDC", color: "#2775CA", title: "USD Coin"  },
  { symbol: "BNB",  color: "#F0B90B", title: "BNB"       },
  { symbol: "LTC",  color: "#A0A4A7", title: "Litecoin"  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FORM FIELD  — reusable labelled input
   ───────────────────────────────────────────────────────────────────────────── */
function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  autoComplete,
  required,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {label}
          {required && <span className="text-[#22C55E] ml-0.5">*</span>}
        </span>
        {hint && <span className="text-[11px] text-gray-600 normal-case tracking-normal">{hint}</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-600 text-[15px] leading-none",
          "bg-white/[0.03] border outline-none transition-all duration-200",
          "focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.14)] focus:border-[#22C55E]/60",
          "hover:border-white/[0.16]",
          error
            ? "border-red-500/50 bg-red-500/[0.04] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
            : "border-white/[0.09]"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="err"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <ExclamationTriangleIcon className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   CHECKOUT PAGE
   ═════════════════════════════════════════════════════════════════════════════ */
export default function Checkout() {
  const [searchParams] = useSearchParams();
  const rawPlan = searchParams.get("plan");
  const planId: PlanId =
    rawPlan === "pro"             ? "pro"             :
    rawPlan === "starter-annual"  ? "starter-annual"  :
    rawPlan === "pro-annual"      ? "pro-annual"      :
    "starter";
  const plan = PLANS[planId];

  /* ── Form state ──────────────────────────────────────────────────────────── */
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");

  const [errors,  setErrors]  = useState<{ name?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});

  /* ── Coupon state ────────────────────────────────────────────────────────── */
  const [appliedCoupon, setAppliedCoupon] = useState<(CouponDef & { code: string }) | null>(null);
  const [couponState, setCouponState]     = useState<"idle" | "valid" | "invalid">("idle");
  const [couponLoading, setCouponLoading] = useState(false);

  /* ── Submission state ────────────────────────────────────────────────────── */
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  /* ── Mobile summary collapsed state ─────────────────────────────────────── */
  const [summaryOpen, setSummaryOpen] = useState(false);

  /* ── Reset submit state if the user navigates back from NOWPayments ─────── */
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setSubmitState("idle");
        setSubmitError("");
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  /* ── Computed pricing ────────────────────────────────────────────────────── */
  const discount = appliedCoupon
    ? parseFloat((plan.price * appliedCoupon.value / 100).toFixed(2))
    : 0;
  const total = parseFloat(Math.max(0, plan.price - discount).toFixed(2));

  /* ── Accessible IDs ──────────────────────────────────────────────────────── */
  const uid = useId();
  const nameId   = `${uid}-name`;
  const emailId  = `${uid}-email`;
  const couponId = `${uid}-coupon`;

  /* ── Validation ──────────────────────────────────────────────────────────── */
  function validateField(field: "name" | "email", value: string): string | undefined {
    if (field === "name") {
      if (!value.trim()) return "Your name is required.";
      if (value.trim().length < 2) return "Please enter at least 2 characters.";
    }
    if (field === "email") {
      if (!value.trim()) return "Your email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Please enter a valid email address.";
    }
  }

  function handleBlur(field: "name" | "email") {
    setTouched((t) => ({ ...t, [field]: true }));
    const val = field === "name" ? name : email;
    const err = validateField(field, val);
    setErrors((e) => ({ ...e, [field]: err }));
  }

  function handleChange(field: "name" | "email", value: string) {
    if (field === "name")  setName(value);
    if (field === "email") setEmail(value);
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((e) => ({ ...e, [field]: err }));
    }
  }

  /* ── Coupon handler ──────────────────────────────────────────────────────── */
  async function handleApplyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    try {
      const res  = await fetch("/api/payments/validate-coupon", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}) as Record<string, unknown>) as {
        valid: boolean;
        discount_percent?: number;
        label?: string;
      };

      if (data.valid && data.discount_percent) {
        setAppliedCoupon({
          code,
          type:  "percent",
          value: data.discount_percent,
          label: data.label ?? `${code} — ${data.discount_percent}% off your first month`,
        });
        setCouponState("valid");
      } else {
        setAppliedCoupon(null);
        setCouponState("invalid");
      }
    } catch {
      setAppliedCoupon(null);
      setCouponState("invalid");
    } finally {
      setCouponLoading(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponState("idle");
  }

  /* ── Submit handler ──────────────────────────────────────────────────────── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Touch all fields to surface any remaining errors
    setTouched({ name: true, email: true });
    const nameErr  = validateField("name",  name);
    const emailErr = validateField("email", email);
    setErrors({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;

    setSubmitState("loading");
    setSubmitError("");

    const orderId = `TRINITY-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    try {
      const url = await initiateNOWPayment({
        name:   name.trim(),
        email:  email.trim().toLowerCase(),
        plan:   planId,
        coupon: appliedCoupon?.code ?? null,
        orderId,
      });
      // Redirect to NOWPayments hosted payment page
      window.location.href = url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitState("error");
      setSubmitError(msg);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#050508] text-white">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(34,197,94,0.06) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(22,163,74,0.05) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
          ════════════════════════════════════════════════════════════════════ */}
      <header
        className="relative z-30 border-b border-white/[0.07]"
        style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" aria-label="Return to Trinity home">
            <img
              src={logoWhite}
              alt="Project Trinity"
              className="h-9 sm:h-10 w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* Center — SSL badge (hidden on xs) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
            <LockClosedIcon className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>256-bit SSL Encrypted Checkout</span>
          </div>

          {/* Back link */}
          <Link
            to="/#pricing"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Back to plans</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 lg:pt-12">

        {/* ── Mobile collapsible plan summary ── */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-white/[0.09] bg-white/[0.03] text-sm"
            aria-expanded={summaryOpen}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: plan.accentColor, boxShadow: `0 0 8px ${plan.accentColor}` }}
              />
              <span className="font-semibold text-white">Trinity {plan.name}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400 font-medium">${total.toFixed(2)}/{plan.period}</span>
              {appliedCoupon && (
                <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                  -{appliedCoupon.value}%
                </span>
              )}
            </div>
            <ChevronLeftIcon
              className="w-4 h-4 text-gray-400 transition-transform duration-200"
              style={{ transform: summaryOpen ? "rotate(-90deg)" : "rotate(90deg)" }}
            />
          </button>

          <AnimatePresence>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <OrderSummaryCard
                    plan={plan}
                    appliedCoupon={appliedCoupon}
                    discount={discount}
                    total={total}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* ══════════════════════════════════════════════════════════════════
              LEFT — CHECKOUT FORM
              ════════════════════════════════════════════════════════════════ */}
          <div>
            {/* Section header */}
            <div className="mb-7">
              <h1 className="font-display text-2xl sm:text-[1.75rem] font-bold text-white leading-snug tracking-tight mb-1.5">
                Complete your order
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                You&apos;re 60 seconds away from activating Trinity. Fill in your details below — we&apos;ll send your licence key to the email you provide.
              </p>
            </div>

            {/* Server error notice */}
            <AnimatePresence>
              {submitState === "error" && submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/[0.07]"
                  role="alert"
                >
                  <p className="text-sm text-red-400 leading-relaxed">{submitError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* ── Contact details block ── */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600">Contact Details</p>

                <FormField
                  id={nameId}
                  label="Full Name"
                  value={name}
                  onChange={(v) => handleChange("name", v)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Alex Martinez"
                  autoComplete="name"
                  error={touched.name ? errors.name : undefined}
                  required
                  hint="As you'd like on your licence"
                />

                <FormField
                  id={emailId}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(v) => handleChange("email", v)}
                  onBlur={() => handleBlur("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={touched.email ? errors.email : undefined}
                  required
                  hint="Licence key & receipt sent here"
                />
              </div>

              {/* ── Coupon block ── */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600">Discount Code</p>

                {appliedCoupon ? (
                  /* Applied state */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/[0.07]"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircleFilledIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#22C55E]">{appliedCoupon.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-gray-500 hover:text-white transition-colors ml-2 flex-shrink-0"
                      aria-label="Remove coupon"
                    >
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  /* Input state */
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                        <input
                          id={couponId}
                          type="text"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value.toUpperCase());
                            if (couponState !== "idle") setCouponState("idle");
                          }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleApplyCoupon(); } }}
                          placeholder="Enter code (e.g. TRINITY20)"
                          autoComplete="off"
                          className={cn(
                            "w-full pl-10 pr-4 py-3.5 rounded-xl text-white placeholder-gray-600 text-[14px] font-mono tracking-wider",
                            "bg-white/[0.03] border outline-none transition-all duration-200",
                            "focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)]",
                            couponState === "invalid"
                              ? "border-red-500/50 focus:border-red-500/70 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                              : "border-white/[0.09] hover:border-white/[0.16] focus:border-[#22C55E]/60"
                          )}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleApplyCoupon()}
                        disabled={!coupon.trim() || couponLoading}
                        className="px-4 py-3 rounded-xl text-sm font-bold border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.10] text-white transition-all disabled:opacity-35 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        {couponLoading ? "Checking…" : "Apply"}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {couponState === "invalid" && (
                        <motion.p
                          key="coupon-invalid"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-1.5 text-xs text-red-400"
                        >
                          <ExclamationTriangleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          This code is not valid or has expired.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ── Payment method block ── */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-600">Payment Method</p>
                  <span className="text-[10px] text-gray-600 font-medium">Powered by NOWPayments.io</span>
                </div>

                {/* Crypto method pills */}
                <div className="flex flex-wrap gap-2">
                  {CRYPTO_METHODS.map(({ symbol, color, title }) => (
                    <div
                      key={symbol}
                      title={title}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03]"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: color }}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-bold text-gray-300 font-mono tracking-wide">{symbol}</span>
                    </div>
                  ))}
                  <div className="flex items-center px-2.5 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.01]">
                    <span className="text-[11px] text-gray-600">+140 more</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  After clicking below you&apos;ll be taken to our secure payment page to choose your preferred cryptocurrency. Your order amount is locked in at today&apos;s rate.
                </p>

                {/* Fiat coming soon strip */}
                <div className="flex items-center gap-2.5 pt-1 border-t border-white/[0.05]">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" aria-hidden="true" />
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    <span className="text-gray-500 font-medium">Credit / debit card payments</span>
                    {" "}are being activated and will be available within a few days.
                  </p>
                </div>
              </div>

              {/* ── Submit ── */}
              <div className="mt-1">
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className={cn(
                    "w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200",
                    "bg-gradient-to-r from-[#22C55E] to-[#16A34A]",
                    "shadow-[0_0_32px_rgba(34,197,94,0.36)] hover:shadow-[0_0_48px_rgba(34,197,94,0.56)]",
                    "hover:scale-[1.01] active:scale-[0.99]",
                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  )}
                  aria-live="polite"
                >
                  {submitState === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Connecting to payment gateway…
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="w-4 h-4" />
                      Proceed to Secure Payment · ${total.toFixed(2)}
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-600 leading-relaxed">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-gray-500 hover:text-white transition-colors underline underline-offset-2">Refund Policy</a>.
                  Your subscription renews at ${plan.renewalPrice.toFixed(2)}/{plan.period} until cancelled.
                </p>
              </div>
            </form>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT — ORDER SUMMARY (desktop only)
              ════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block">
            <div className="sticky top-8 flex flex-col gap-5">
              <OrderSummaryCard
                plan={plan}
                appliedCoupon={appliedCoupon}
                discount={discount}
                total={total}
              />
              <TrustPanel />
            </div>
          </div>

        </div>

        {/* Trust panel — mobile only, below form */}
        <div className="mt-8 lg:hidden">
          <TrustPanel />
        </div>

      </main>

      {/* ── Bottom bar ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700 text-center">
            © 2026 Project Trinity · All rights reserved · Trading involves risk
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <Link to="/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-use" className="hover:text-gray-400 transition-colors">Terms</Link>
            <a href="https://t.me/tti_mark_support" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER SUMMARY CARD  — shared between mobile accordion and desktop sidebar
   ───────────────────────────────────────────────────────────────────────────── */
function OrderSummaryCard({
  plan,
  appliedCoupon,
  discount,
  total,
}: {
  plan: (typeof PLANS)[PlanId];
  appliedCoupon: (CouponDef & { code: string }) | null;
  discount: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0a0e1a] overflow-hidden">

      {/* Plan header */}
      <div
        className="px-5 py-4 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(22,163,74,0.04) 100%)" }}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#22C55E]/70 mb-0.5">
            {plan.badge}
          </p>
          <p className="font-display font-bold text-lg text-white leading-none">
            Trinity {plan.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display font-extrabold text-2xl text-white leading-none">
            ${total.toFixed(2)}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">/ {plan.period}</p>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 py-4 flex flex-col gap-2.5 border-b border-white/[0.06]">
        {plan.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckCircleFilledIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-400 leading-snug">{f}</span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-white font-medium">${plan.price.toFixed(2)}</span>
        </div>

        <AnimatePresence>
          {appliedCoupon && (
            <motion.div
              key="discount-line"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex justify-between text-sm">
                <span className="text-[#22C55E]/80 flex items-center gap-1.5">
                  <TagIcon className="w-3.5 h-3.5" />
                  {appliedCoupon.code}
                </span>
                <span className="text-[#22C55E] font-bold">−${discount.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-3 border-t border-white/[0.07]">
          <span className="font-bold text-white">Due today</span>
          <span className="font-display font-extrabold text-xl text-white">${total.toFixed(2)}</span>
        </div>

        <p className="text-[11px] text-gray-600 leading-relaxed">
          {plan.renewalNote}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TRUST PANEL  — security badges + guarantee
   ───────────────────────────────────────────────────────────────────────────── */
function TrustPanel() {
  const items = [
    {
      Icon: LockClosedIcon,
      title: "256-bit SSL Encryption",
      desc: "Your personal and payment data is fully encrypted in transit.",
    },
    {
      Icon: ArrowUturnLeftIcon,
      title: "30-day money-back guarantee",
      desc: "If Trinity doesn't perform for you, you get a full refund. No questions asked.",
    },
    {
      Icon: ShieldCheckIcon,
      title: "NOWPayments security",
      desc: "Payments are processed by NOWPayments.io — one of the most trusted crypto gateways.",
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 flex flex-col gap-4">
      {items.map(({ Icon, title, desc }) => (
        <div key={title} className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E]/[0.10] border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0 mt-px">
            <Icon className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-300 leading-snug mb-0.5">{title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}

      {/* Support line */}
      <div className="pt-3 border-t border-white/[0.06] text-center">
        <p className="text-xs text-gray-600">
          Questions?{" "}
          <a
            href="https://t.me/tti_mark_support"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22C55E]/80 hover:text-[#22C55E] transition-colors font-semibold"
          >
            Chat with us on Telegram
          </a>
          {" "}— we reply in minutes.
        </p>
      </div>
    </div>
  );
}
