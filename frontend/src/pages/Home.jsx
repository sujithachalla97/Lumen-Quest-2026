import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
              — fast, simple, and beautiful.
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

      {/* Feature Section 1 */}
      <section className="feature-section">
        <div className="feature-container">
          <motion.img
            src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=900&q=80"
            alt="Easy management"
            className="feature-img"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="feature-text"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Effortless Management</h2>
            <p>
              Subscribe, cancel, renew, or switch plans in seconds. Always stay
              in control with a clean and intuitive design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 2 */}
      <section className="feature-section alt">
        <div className="feature-container">
          <motion.div
            className="feature-text"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Smart Recommendations</h2>
            <p>
              AI-powered insights help you pick the best plan for your needs —
              personalized and value-for-money.
            </p>
          </motion.div>
          <motion.img
            src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=900&q=80"
            alt="Smart recommendations"
            className="feature-img"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Feature Section 3 */}
      <section className="feature-section">
        <div className="feature-container">
          <motion.img
            src="https://images.unsplash.com/photo-1605902711622-fd2a7f4c1c7d?auto=format&fit=crop&w=900&q=80"
            alt="Secure"
            className="feature-img"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.div
            className="feature-text"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Secure & Reliable</h2>
            <p>
              Your data is safe. Role-based access ensures only you can manage
              your subscriptions.
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
