import styled from "styled-components";
import { spacing, colors, breakpoints } from "../theme";

// Main row container
export const ChildRowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing.md};
  align-items: start;
  padding: ${spacing.md};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  margin-bottom: ${spacing.md};
  transition: all 0.25s ease;
  background: ${colors.card};
  position: relative;

  &.ready {
    border-color: ${colors.okSoft};
  }

&.due {
  border: 2px solid ${colors.warn};
  background:
    linear-gradient(${colors.warnSoft}, ${colors.warnSoft}),
    ${colors.card};
  animation: duePulse 1.2s ease-in-out infinite;
}

&.overdue {
  border: 2px solid ${colors.danger};
  background:
    linear-gradient(${colors.dangerSoft}, ${colors.dangerSoft}),
    ${colors.card};
  animation: overduePulse 1s ease-in-out infinite;
}
  @keyframes duePulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 ${colors.warnPulse};
    }
    50% {
      box-shadow: 0 0 0 3px ${colors.warnPulseSoft};
    }
  }

  @keyframes overduePulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 ${colors.dangerPulse};
    }
    50% {
      box-shadow: 0 0 0 3px ${colors.dangerPulseSoft};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
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
  color: ${colors.warn};
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
  font-size: 23px;
  font-weight: 650;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  color: ${({ $isOverdue }) =>
    $isOverdue ? colors.danger : colors.accent};
  letter-spacing: 0;
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

// Primary actions group
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
  background: ${colors.dangerMedium};
  border-color: ${colors.danger};
  color: ${colors.danger};

  &:hover:not(:disabled) {
    background: ${colors.dangerStrong};
  }

  &.urgent {
    background: ${colors.danger};
    color: white;
    font-weight: 700;
  }

  &.urgent:hover:not(:disabled) {
    background: ${colors.dangerHover};
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
  background: ${colors.surfaceSoft};
  border: 1px solid ${colors.border};

  &:hover:not(:disabled) {
    background: ${colors.surfaceHover};
    border-color: ${colors.borderStrong};
  }
`;

// Dropdown menu
export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 2px;
  background: ${colors.card};
  border: 1px solid ${colors.border};
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
    background: ${colors.surfaceHover};
  }

  &.danger {
    color: ${colors.danger};
  }

  &.danger:hover {
    background: ${colors.dangerSoft};
  }
`;

export default ChildRowContainer;
