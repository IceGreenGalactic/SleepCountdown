import { useState, useEffect } from "react";
import ChildRowStyled from "./ChildRow.styled";
import { fmtTime, fmtDur, fmtRange, fmtDurShort } from "../helpers";

export default function ChildRow({
  child,
  onEdit,
  onDelete,
  onStart,
  onStop,
  onManual,
}) {
  const [remaining, setRemaining] = useState(null);
  const [isOverdue, setIsOverdue] = useState(false);
  const [isDue, setIsDue] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Update countdown timer every second
  useEffect(() => {
    if (!child.wakeAtTs) return;

    const updateCountdown = () => {
      const now = Date.now();
      const rem = child.wakeAtTs - now;
      setRemaining(rem);
      setIsOverdue(rem <= 0);
      setIsDue(rem > 0 && rem <= 60000);
    };

    updateCountdown(); // Run immediately
    const interval = setInterval(updateCountdown, 500);
    return () => clearInterval(interval);
  }, [child.wakeAtTs]);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit();
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  const isActive = child.napStartTs && child.wakeAtTs;
  const lastLog = child.logs?.[0];
  const over = isOverdue ? Math.abs(remaining) : 0;

  return (
    <ChildRowStyled
      className={isOverdue ? "overdue" : isDue ? "due" : "ready"}
      onClick={() => setShowMenu(false)}
    >
      <div className="meta">
        <div className="header">
          <div className="name">{child.name}</div>
          <div className="badge">
            {isOverdue && <span className="badge-overdue">🚨 Over tiden</span>}
            {isDue && !isOverdue && (
              <span className="badge-due">⚠️ Snart opp</span>
            )}
            {isActive && !isDue && !isOverdue && (
              <span className="badge-active">⏳ Sover</span>
            )}
            {!isActive && <span className="badge-ready">🟢 Våken</span>}
          </div>
          <div className="menu-container">
            <button
              className="btn-menu"
              onClick={handleMenuClick}
              title="More options"
              aria-label="Menu"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item" onClick={handleEdit}>
                  Rediger
                </button>
                <button className="menu-item danger" onClick={handleDelete}>
                  Slett
                </button>
              </div>
            )}
          </div>
        </div>

        {isActive ? (
          <div className="timeline">
            Skal opp:
            <span className="end-time">{fmtTime(child.wakeAtTs)}</span>
          </div>
        ) : (
          <div className="max-nap">{child.maxMinutes} min max</div>
        )}

        {isActive && (
          <div className="timer-display">
            {isOverdue ? (
              <div className="timer overdue-text">
                {over > 0 ? fmtDur(over) : "0:00"} OVER
              </div>
            ) : (
              <div className="timer">{fmtDur(remaining)}</div>
            )}
          </div>
        )}

        {!isActive && lastLog && (
          <div className="history">
            Siste: {fmtRange(lastLog.start, lastLog.end)} (
            {fmtDurShort(lastLog.durMs)})
          </div>
        )}
      </div>

      <div className="actions">
        {!isActive && (
          <div className="primary-actions">
            <button onClick={onStart} className="primary btn-start">
              Start Nap
            </button>
            <button
              onClick={onManual}
              className="btn-manual"
              title="Manuell start"
            >
              Manuell
            </button>
          </div>
        )}
        {isActive && (
          <button
            onClick={onStop}
            className={`btn-stop ${isOverdue ? "urgent" : "warning"}`}
          >
            {isOverdue ? "🛑 STOP" : "Stop"}
          </button>
        )}
      </div>
    </ChildRowStyled>
  );
}
