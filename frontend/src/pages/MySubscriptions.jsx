import React, { useMemo, useState } from "react";
import { useSubscriptions } from "../context/SubscriptionContext";
import Spinner from "../components/Spinner";
import ActionModal from "../components/ActionModal";
import "./MySubscriptions.css";

export default function MySubscriptions() {
  const { plans, userSubs, loading, changePlan, cancel, renew } =
    useSubscriptions();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(null);

  const planMap = useMemo(() => {
    const m = {};
    (plans || []).forEach((p) => (m[p.id] = p));
    return m;
  }, [plans]);

  const currentSub = userSubs.find((s) => s.status === "active") || null;
  const previousSubs = userSubs.filter((s) => s.status === "cancelled");

  const handleChange = async (subId, newPlanId) => {
    setProcessing(true);
    try {
      await changePlan(subId, newPlanId);
      setMessage("✅ Plan changed successfully");
    } catch {
      setMessage("⚠️ Failed to change plan");
    } finally {
      setProcessing(false);
      setShowChangeModal(null);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleCancel = async (subId) => {
    setProcessing(true);
    try {
      await cancel(subId);
      setMessage("❌ Subscription cancelled");
    } catch {
      setMessage("⚠️ Failed to cancel");
    } finally {
      setProcessing(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleRenew = async (subId) => {
    setProcessing(true);
    try {
      await renew(subId);
      setMessage("🔄 Subscription renewed");
    } catch {
      setMessage("⚠️ Failed to renew");
    } finally {
      setProcessing(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="subscriptions-page container">
      <h2 className="page-title">My Subscriptions</h2>
      {message && <div className="alert mt">{message}</div>}

      {/* Current Subscription */}
      {currentSub && (
        <div className="sub-card">
          <h3 className="section-title">Current Subscription</h3>
          <div className="sub-item">
            <div className="sub-left">
              <h4 className="plan-name">{planMap[currentSub.planId]?.name}</h4>
              <p className="plan-price">
                ₹ {planMap[currentSub.planId]?.price} / month
              </p>
              <p className="plan-date">
                Started: {new Date(currentSub.startedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="sub-features-list">
              {planMap[currentSub.planId]?.features?.map((f, i) => (
                <div key={i} className="feature-line">
                  <span>✔</span> {f}
                </div>
              ))}
            </div>

            <div className="sub-actions">
              <button
                className="btn btn-outline small-btn"
                onClick={() => setShowChangeModal(currentSub)}
              >
                Change Plan
              </button>
              <button
                className="btn btn-cancel small-btn"
                onClick={() => handleCancel(currentSub.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Previous Subscriptions */}
      {previousSubs.length > 0 && (
        <div className="sub-card">
          <h3 className="section-title">Previous Subscriptions</h3>
          {previousSubs.map((s) => (
            <div key={s.id} className="sub-item">
              <div className="sub-left">
                <h4 className="plan-name">
                  {planMap[s.planId]?.name || s.planId}
                </h4>
                <p className="plan-price">
                  ₹ {planMap[s.planId]?.price} / month
                </p>
                <p className="plan-date">
                  Started: {new Date(s.startedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="sub-features-list">
                {planMap[s.planId]?.features?.map((f, i) => (
                  <div key={i} className="feature-line">
                    <span>✔</span> {f}
                  </div>
                ))}
              </div>

              <div className="sub-actions">
                <button
                  className="btn btn-renew small-btn"
                  disabled={processing}
                  onClick={() => handleRenew(s.id)}
                >
                  Renew
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Change Plan Modal */}
      {showChangeModal && (
        <ActionModal
          title="Change Plan"
          onClose={() => setShowChangeModal(null)}
          onConfirm={() => {}}
          confirmLabel="Close"
        >
          <div className="change-plan-options">
            {plans
              .filter((p) => p.id !== showChangeModal.planId)
              .map((p) => (
                <div key={p.id} className="change-plan-card">
                  <div>
                    <h4>{p.name}</h4>
                    <p>₹ {p.price} / month</p>
                  </div>
                  <button
                    className="btn btn-primary small-btn"
                    disabled={processing}
                    onClick={() => handleChange(showChangeModal.id, p.id)}
                  >
                    Switch
                  </button>
                </div>
              ))}
          </div>
        </ActionModal>
      )}
    </div>
  );
}
