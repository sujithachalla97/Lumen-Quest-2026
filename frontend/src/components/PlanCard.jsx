import React from "react";

export default function PlanCard({ plan, onSubscribe, onSelect }) {
  return (
    <div className="card">
      <div className="plan-name">{plan.name}</div>
      <div className="small mt">Quota: {plan.quotaGB} GB</div>
      <div className="plan-price">₹ {plan.price} / month</div>

      <ul className="small mt">
        {plan.features?.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <div className="mt row">
        <button
          className="btn btn-primary"
          onClick={() => onSubscribe(plan.id)}
        >
          Subscribe
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => onSelect && onSelect(plan)}
        >
          View
        </button>
      </div>
    </div>
  );
}
