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
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleSubscribe = async (planId) => {
    try {
      setLoadingId(planId);
      await subscribe(planId);
      // no message popup
    } catch (e) {
      setMessage("Failed to subscribe");
    } finally {
      setLoadingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getRecommendedPlan = () => {
    if (!plans || plans.length === 0) return null;
    // Simple recommendation: Best value = highest quota/lowest price
    return plans.reduce((best, p) =>
      p.quotaGB / p.price > best.quotaGB / best.price ? p : best
    );
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

          {/* ✅ Recommendation Section */}
          <div className="recommendation-section">
            <h3>Not sure which plan to choose?</h3>
            <button
              className="btn recommend-btn"
              onClick={() => setShowRecommendation(!showRecommendation)}
            >
              {showRecommendation ? "Hide Recommendation" : "Recommend a Plan"}
            </button>

            {showRecommendation && (
              <motion.div
                className="recommendation-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {getRecommendedPlan() ? (
                  <>
                    <h4>
                      🎯 We recommend the{" "}
                      <span className="highlight">
                        {getRecommendedPlan().name}
                      </span>{" "}
                      plan
                    </h4>
                    <p>
                      <strong>Price:</strong> ₹{getRecommendedPlan().price} /
                      month <br />
                      <strong>Data:</strong> {getRecommendedPlan().quotaGB} GB
                    </p>
                    <ul>
                      {getRecommendedPlan().features.map((f, i) => (
                        <li key={i}>✔ {featureLabels[f] || f}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No plans available to recommend.</p>
                )}
              </motion.div>
            )}
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
