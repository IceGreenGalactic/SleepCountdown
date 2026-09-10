import styled from "styled-components";
import { spacing, colors } from "../theme";

// Main row container
export const ChildRowContainer = styled.div`
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
  }
`;

// Left section - content
export const MetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  min-width: 0;
`;

// Header row - name + badge + menu
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: ${spacing.md};
`;

// Child name
export const Name = styled.div`
  font-weight: 700;
  font-size: 18px;
  text-decoration: underline;
  color: ${colors.text};
`;

// Status badge section
export const BadgeSection = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const BadgeText = styled.span`
  color: ${({ variant }) => {
    switch (variant) {
      case "ready":
        return colors.ok;
      case "active":
        return colors.accent;
      case "due":
        return colors.warn;
      case "overdue":
        return colors.danger;
      default:
        return colors.text;
    }
  }};
`;

// Timeline section (when active)
export const Timeline = styled.div`
  font-size: 12px;
  color: ${colors.muted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TimelineTime = styled.span`
  white-space: nowrap;
  font-size: 16px;
  color: Orange;
`;

export const TimelineSeparator = styled.span`
  opacity: 0.6;
`;

// Max nap duration (when inactive)
export const MaxNap = styled.div`
  font-size: 12px;
  color: ${colors.muted};
`;

// Timer display section
export const TimerDisplay = styled.div`
  margin-top: 2px;
`;

// Large timer text
export const Timer = styled.div`
  font-size: 22px;
  font-weight: 700;
  font-family: "Monaco", "Courier New", monospace;
  color: ${({ $isOverdue }) => ($isOverdue ? colors.danger : colors.accent)};
  letter-spacing: 1px;
  text-align: center;
`;

// History section (last sleep log)
export const History = styled.div`
  font-size: 11px;
  color: ${colors.muted};
  opacity: 0.8;
`;

// Right section - actions
export const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  align-items: stretch;
`;

// Primary actions group (Start/Manual or Stop)
export const PrimaryActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

// Start button
export const StartButton = styled.button`
  min-height: 40px;
  font-size: 13px;
  font-weight: 600;
`;

// Manual button
export const ManualButton = styled.button`
  min-height: 36px;
  font-size: 12px;
  font-weight: 500;
`;

// Stop button
export const StopButton = styled.button`
  min-height: 40px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.15);
  border-color: ${colors.danger};
  color: ${colors.danger};

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.25);
  }

  &.urgent {
    background: ${colors.danger};
    color: white;
    font-weight: 700;
  }

  &.urgent:hover:not(:disabled) {
    background: #dc2626;
  }
`;

// Menu container
export const MenuContainer = styled.div`
  position: relative;
`;

// Menu button
export const MenuButton = styled.button`
  min-height: 36px;
  min-width: 36px;
  padding: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

// Dropdown menu
export const DropdownMenu = styled.div`
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
`;

// Menu item
export const MenuItem = styled.button`
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

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.danger {
    color: ${colors.danger};
  }

  &.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

// Default export for backwards compatibility
export default ChildRowContainer;
