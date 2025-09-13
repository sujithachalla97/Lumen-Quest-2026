import React from "react";

export default function ActionModal({
  title,
  children,
  onConfirm,
  onClose,
  confirmLabel = "Confirm",
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 420,
          background: "white",
          padding: 18,
          borderRadius: 10,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
        <div style={{ marginBottom: 12 }}>{children}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
