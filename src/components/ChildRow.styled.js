import styled from "styled-components";
import { spacing, colors } from "../theme";

export default styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing.md};
  align-items: start;
  padding: ${spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-bottom: ${spacing.md};
  transition: all 0.25s ease;
  background: rgba(255, 255, 255, 0.02);
  position: relative;

  .meta {
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
    min-width: 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: ${spacing.md};
  }

  .name {
    font-weight: 700;
    font-size: 16px;
    color: ${colors.text};
  }

  .badge {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .badge-ready {
    color: ${colors.ok};
  }

  .badge-active {
    color: ${colors.accent};
  }

  .badge-due {
    color: ${colors.warn};
  }

  .badge-overdue {
    color: ${colors.danger};
  }

  .timeline {
    font-size: 12px;
    color: ${colors.muted};
    display: flex;
    align-items: center;
    gap: 4px;
  }


 .end-time {
    white-space: nowrap;
    font-size: 16px;
    color: Orange;
  }
  .sep {
    opacity: 0.6;
  }

  .max-nap {
    font-size: 12px;
    color: ${colors.muted};
  }

  .timer-display {
    margin-top: 2px;
  }

  .timer {
    font-size: 22px;
    font-weight: 700;
    font-family: "Monaco", "Courier New", monospace;
    color: ${colors.accent};
    letter-spacing: 1px;
  }

  .timer.overdue-text {
    color: ${colors.danger};
  }

  .history {
    font-size: 11px;
    color: ${colors.muted};
    opacity: 0.8;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm};
    align-items: stretch;
  }

  .primary-actions {
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
  }

  .btn-start {
    min-height: 40px;
    font-size: 13px;
    font-weight: 600;
  }

  .btn-manual {
    min-height: 36px;
    font-size: 12px;
    font-weight: 500;
  }

  .btn-stop {
    min-height: 40px;
    font-size: 13px;
    font-weight: 600;
    background: rgba(239, 68, 68, 0.15);
    border-color: ${colors.danger};
    color: ${colors.danger};
  }

  .btn-stop:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.25);
  }

  .btn-stop.urgent {
    background: ${colors.danger};
    color: white;
    font-weight: 700;
  }

  .btn-stop.urgent:hover:not(:disabled) {
    background: #dc2626;
  }

  .menu-container {
    position: relative;
  }

  .btn-menu {
    min-height: 36px;
    min-width: 36px;
    padding: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .btn-menu:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 2px;
    background: ${colors.card};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10;
    min-width: 120px;
    overflow: hidden;
  }

  .menu-item {
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    font-size: 13px;
    background: transparent;
    border: none;
    color: ${colors.text};
    cursor: pointer;
    transition: background 0.2s ease;
    border-radius: 0;
    min-height: auto;
    display: block;
    font-weight: 500;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .menu-item.danger {
    color: ${colors.danger};
  }

  .menu-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  /* State styling */
  &.ready {
    border-color: rgba(52, 211, 153, 0.2);
  }

  &.due {
    border: 2px solid ${colors.warn};
    background: rgba(251, 191, 36, 0.08);
    animation: duePulse 1.2s ease-in-out infinite;
  }

  &.overdue {
    border: 2px solid ${colors.danger};
    background: rgba(239, 68, 68, 0.08);
    animation: overduePulse 1s ease-in-out infinite;
  }

  @keyframes duePulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.2);
    }
    50% {
      box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
    }
  }

  @keyframes overduePulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3);
    }
    50% {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    .header {
      flex-direction: row;
    }

    .actions {
      grid-column: 1;
    }
  }
`;
