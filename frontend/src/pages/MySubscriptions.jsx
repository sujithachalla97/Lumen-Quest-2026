import React, { useMemo, useState } from "react";
import { useSubscriptions } from "../context/SubscriptionContext";
import ActionModal from "../components/ActionModal";
import Spinner from "../components/Spinner";

export default function MySubscriptions() {
  const { plans, userSubs, loading, changePlan, cancel, renew } =
    useSubscriptions();
  const [activeSub, setActiveSub] = useState(null);
  const [message, setMessage] = useState("");
  const [showChangeModal, setShowChangeModal] = useState(null);
  const [processing, setProcessing] = useState(false);

  const planMap = useMemo(() => {
    const m = {};
    (plans || []).forEach((p) => {
      m[p.id] = p;
    });
    return m;
  }, [plans]);

  const handleChange = async (subId, newPlanId) => {
    setProcessing(true);
    try {
      await changePlan(subId, newPlanId);
      setMessage("Plan changed successfully");
    } catch (e) {
      setMessage("Failed to change plan");
    } finally {
      setProcessing(false);
      setShowChangeModal(null);
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const handleCancel = async (subId) => {
    setProcessing(true);
    try {
      await cancel(subId);
      setMessage("Subscription cancelled");
    } catch (e) {
      setMessage("Failed to cancel");
    } finally {
      setProcessing(false);
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const handleRenew = async (subId) => {
    setProcessing(true);
    try {
      await renew(subId);
      setMessage("Subscription renewed");
    } catch (e) {
      setMessage("Failed to renew");
    } finally {
      setProcessing(false);
      setTimeout(() => setMessage(""), 2200);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <h3>My Subscriptions</h3>
      {message && <div className="alert mt">{message}</div>}
      {userSubs.length === 0 && (
        <div className="card mt">
          <div>No subscriptions yet. Go to Plans to subscribe.</div>
        </div>
      )}
      {userSubs.length > 0 && (
        <div className="card mt">
          <table className="table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Status</th>
                <th>Started</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userSubs.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>
                      {planMap[s.planId]?.name || s.planId}
                    </div>
                    <div className="small">
                      ₹ {planMap[s.planId]?.price} / month
                    </div>
                  </td>
                  <td>
                    <span className="badge">{s.status}</span>
                  </td>
                  <td className="small">
                    {new Date(s.startedAt).toLocaleString()}
                  </td>
                  <td>
                    <div className="row">
                      <button
                        className="btn btn-ghost"
                        onClick={() => setShowChangeModal(s)}
                      >
                        Change Plan
                      </button>
                      {s.status !== "cancelled" ? (
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleCancel(s.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRenew(s.id)}
                        >
                          Renew
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showChangeModal && (
        <ActionModal
          title="Change Plan"
          onClose={() => setShowChangeModal(null)}
          onConfirm={() => {}}
          confirmLabel="Close"
        >
          <div className="small">Select a new plan:</div>
          <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
            {plans
              .filter((p) => p.id !== showChangeModal.planId)
              .map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 8,
                    border: "1px solid #f1f5f9",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div className="small">₹ {p.price} / month</div>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      disabled={processing}
                      onClick={() => handleChange(showChangeModal.id, p.id)}
                    >
                      Switch
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </ActionModal>
      )}
    </div>
  );
}
