import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";
import PaymentCancelled from "@/pages/PaymentCancelled";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import RefundPolicy from "@/pages/RefundPolicy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}
