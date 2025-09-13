import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BrowsePlans from "./pages/BrowsePlans";
import MySubscriptions from "./pages/MySubscriptions";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<BrowsePlans />} />
        <Route path="/my" element={<MySubscriptions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <div className="footer">
        Built for Lumen Quest 2.0 — Subscription Management (Frontend demo)
      </div>
    </>
  );
}
