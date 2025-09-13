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

export default function PlanCard({
  plan,
  onSubscribe,
  onSelect,
  isSubscribed,
}) {
  return (
    <motion.div
      className="card plan-card"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="plan-header">
        <div className="plan-name">{plan.name}</div>
        <div className="plan-price">₹ {plan.price} / month</div>
      </div>

      <ul className="plan-features">
        {plan.features?.map((f, i) => (
          <li key={i}>{featureLabels[f] || f}</li>
        ))}
      </ul>

      <div className="plan-actions">
        <button
          className={`btn btn-primary ${isSubscribed ? "disabled-btn" : ""}`}
          disabled={isSubscribed}
          onClick={() => !isSubscribed && onSubscribe(plan.id)}
        >
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => onSelect && onSelect(plan)}
        >
          View
        </button>
      </div>
    </motion.div>
  );
}
