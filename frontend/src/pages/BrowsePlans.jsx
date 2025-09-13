import React, { useState } from "react";
import { useSubscriptions } from "../context/SubscriptionContext";
import PlanCard from "../components/PlanCard";
import ActionModal from "../components/ActionModal";
import Spinner from "../components/Spinner";
import "./Plans.css";

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
      setTimeout(() => setMessage(""), 2200);
    }
  };

  if (!plans) return <Spinner />;

  return (
    <div className="plans-page">
      <div className="container">
        <h2 className="plans-title">Choose Your Perfect Plan</h2>
        <p className="plans-subtitle">
          Flexible and affordable subscription options designed to fit your
          needs.
        </p>

        {message && <div className="alert mt">{message}</div>}

        <div className="plans-grid">
          {plans.map((p) => (
            <div key={p.id}>
              <PlanCard
                plan={p}
                onSubscribe={(id) => handleSubscribe(id)}
                onSelect={(pl) => setSelected(pl)}
              />
              {loadingId === p.id && <div className="small">Processing...</div>}
            </div>
          ))}
        </div>
      </div>

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
              <li key={i}>{f}</li>
            ))}
          </ul>
        </ActionModal>
      )}
    </div>
  );
}
