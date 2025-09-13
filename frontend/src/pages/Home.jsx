import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Sparkles, ShieldCheck } from "lucide-react"; // icons
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="hero-title">
              All Your Subscriptions <br /> One Smart Dashboard
            </h1>
            <p className="hero-subtitle">
              Browse, subscribe, upgrade, and manage all your plans at one place
              — simple, fast, and beautiful.
            </p>
            <div className="hero-buttons">
              <Link to="/plans">
                <button className="btn btn-primary big-btn">
                  Explore Plans
                </button>
              </Link>
              <Link to="/my">
                <button className="btn btn-primary big-btn">
                  My Subscriptions
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections with Icons */}
      <section className="features-wrapper">
        <div className="feature-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Settings size={60} className="feature-icon" />
            <h2>Effortless Management</h2>
            <p>
              Subscribe, cancel, renew, or switch plans in seconds. Always stay
              in control with a clean and intuitive design.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles size={60} className="feature-icon" />
            <h2>Smart Recommendations</h2>
            <p>
              AI-powered insights help you pick the best plan — personalized,
              cost-effective, and reliable.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <ShieldCheck size={60} className="feature-icon" />
            <h2>Secure & Reliable</h2>
            <p>
              Your data stays safe. Role-based access ensures only you can
              manage your subscriptions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-banner">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Simplify Your Life?</h2>
          <p>
            Start today and experience subscription management like never
            before.
          </p>
          <Link to="/plans">
            <button className="btn btn-primary big-btn">Get Started</button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
