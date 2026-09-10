import { useState, useEffect } from "react";
import ManualDialogStyled from "./ManualDialog.styled";
import { parseTimeToTimestamp } from "../helpers";

export default function ManualDialog({ isOpen, childName, onSubmit, onClose }) {
  const [startTime, setStartTime] = useState("");
  const [overrideMinutes, setOverrideMinutes] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStartTime("");
      setOverrideMinutes("");
      // Focus first input when dialog opens
      setTimeout(() => {
        const input = document.querySelector("[data-dialog-focus]");
        input?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime) {
      alert("Vennligst oppgi starttid");
      return;
    }
    const ts = parseTimeToTimestamp(startTime);
    if (!ts) {
      alert("Ugyldig starttid");
      return;
    }
    onSubmit(startTime, overrideMinutes ? Number(overrideMinutes) : null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ManualDialogStyled onClick={handleBackdropClick}>
      <div className="dialog-content">
        <button
          className="dialog-close"
          onClick={onClose}
          aria-label="Lukk"
          type="button"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit}>
          <h3>Manuell start</h3>
          <p
            style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 16px 0" }}
          >
            {childName}
          </p>

          <label>
            Starttid (sovnet kl)
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              data-dialog-focus
              autoFocus
            />
          </label>

          <label>
            Minutter denne gangen (valgfritt)
            <input
              type="number"
              value={overrideMinutes}
              onChange={(e) => setOverrideMinutes(e.target.value)}
              min="1"
              step="1"
              placeholder="Endre sovelengde"
            />
          </label>

          <div className="button-group">
            <button type="submit" className="primary">
              Start
            </button>
            <button type="button" className="ghost" onClick={onClose}>
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </ManualDialogStyled>
  );
}
