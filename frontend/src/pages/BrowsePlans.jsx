import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSubscriptions } from "../context/SubscriptionContext";
import PlanCard from "../components/PlanCard";
import ActionModal from "../components/ActionModal";
import Spinner from "../components/Spinner";
import "./Plans.css";

const featureLabels = {
  PhoneService: "Phone Service",
  OnlineSecurity: "Online Security",
  OnlineBackup: "Online Backup",
  DeviceProtection: "Device Protection",
  TechSupport: "Tech Support",
  StreamingTV: "Streaming TV",
  StreamingMovies: "Streaming Movies",
};

export default function BrowsePlans() {
  const { plans, subscribe } = useSubscriptions();
  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (planId) => {
    try {
      setLoadingId(planId);
      await subscribe(planId);
      setMessage("Subscribed successfully!");
    } catch (e) {
      setMessage("Failed to subscribe");
    } finally {
      setLoadingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!plans) return <Spinner />;

  return (
    <div className="plans-page">
      {/* Hero Banner */}
      <section className="plans-hero">
        <div className="plans-hero-overlay">
          <motion.div
            className="plans-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="plans-title">Choose Your Perfect Plan</h1>
            <p className="plans-subtitle">
              Flexible and affordable subscription options designed to fit your
              needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="plans-grid-section">
        <div className="container">
          {message && <div className="alert mt">{message}</div>}

          <div className="plans-grid">
            {plans.map((p) => (
              <div key={p.id}>
                <PlanCard
                  plan={p}
                  onSubscribe={(id) => handleSubscribe(id)}
                  onSelect={(pl) => setSelected(pl)}
                />
                {loadingId === p.id && (
                  <div className="small">Processing...</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Modal */}
      {selected && (
        <ActionModal
          title={`Plan: ${selected.name}`}
          onClose={() => setSelected(null)}
          onConfirm={() => {
            handleSubscribe(selected.id);
            setSelected(null);
          }}
          confirmLabel="Subscribe"
        >
          <div>
            <strong>Price:</strong> ₹{selected.price} / month
          </div>
          <div className="mt small">Features:</div>
          <ul>
            {selected.features.map((f, i) => (
              <li key={i}>✅ {featureLabels[f] || f}</li>
            ))}
          </ul>
        </ActionModal>
      )}
    </div>
  );
}
