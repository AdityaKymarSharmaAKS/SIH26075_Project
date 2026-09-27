import React from "react";
import "./modal.css";

export default function AssessmentDetailsModal({ assessment, open, onClose }) {
  if (!open || !assessment) return null;

  const { title, domain, score, status, description } = assessment;

  return (
    <div className="adm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-header">
          <h2>{title || "Assessment Details"}</h2>
          <button className="adm-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="adm-body">
          <p><strong>Domain:</strong> {domain || "—"}</p>
          <p><strong>Score:</strong> {Number(score ?? 0)}%</p>
          <p><strong>Status:</strong> {status || "Recorded"}</p>
          {description && <div className="adm-desc"><strong>Description</strong><p>{description}</p></div>}
        </div>
        <div className="adm-footer">
          <button className="primary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
