import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Checkout from "@/pages/Checkout";
import ThankYou from "@/pages/ThankYou";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}
