import React from "react";
import { motion } from "framer-motion";

const featureLabels = {
  PhoneService: "Phone Service",
  OnlineSecurity: "Online Security",
  OnlineBackup: "Online Backup",
  DeviceProtection: "Device Protection",
  TechSupport: "Tech Support",
  StreamingTV: "Streaming TV",
  StreamingMovies: "Streaming Movies",
};

export default function PlanCard({ plan, onSubscribe, isSubscribed }) {
  return (
    <motion.div
      className="card plan-card"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="plan-header">
        <div className="plan-name">{plan.name}</div>
        <div className="plan-price">₹ {plan.price} / month</div>
      </div>

      {/* Features with animation */}
      <ul className="plan-features centered">
        {plan.features?.map((f, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {featureLabels[f] || f}
          </motion.li>
        ))}
      </ul>

      {/* Subscribe Button */}
      <div className="plan-actions">
        <button
          className="btn subscribe-btn"
          disabled={isSubscribed}
          onClick={() => !isSubscribed && onSubscribe(plan.id)}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </motion.div>
  );
}
