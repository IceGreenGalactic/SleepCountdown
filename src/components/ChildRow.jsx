import { useState, useEffect } from "react";
import { fmtTime, fmtDur, fmtRange, fmtDurShort } from "../helpers";
import {
  ChildRowContainer,
  MetaSection,
  Header,
  Name,
  BadgeSection,
  BadgeText,
  Timeline,
  TimelineTime,
  TimelineSeparator,
  MaxNap,
  TimerDisplay,
  Timer,
  History,
  ActionsSection,
  PrimaryActions,
  StartButton,
  ManualButton,
  StopButton,
  MenuContainer,
  MenuButton,
  DropdownMenu,
  MenuItem,
} from "./ChildRow.styled";

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
    if (!child.wakeAtTs) {
      setRemaining(null);
      setIsOverdue(false);
      setIsDue(false);
      return;
    }

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
    <ChildRowContainer
      className={isOverdue ? "overdue" : isDue ? "due" : "ready"}
      onClick={() => setShowMenu(false)}
    >
      <MetaSection>
        <Header>
          <Name>{child.name}</Name>
          <BadgeSection>
            {isOverdue && (
              <BadgeText variant="overdue">🚨 Over tiden</BadgeText>
            )}
            {isDue && !isOverdue && (
              <BadgeText variant="due">⚠️ Snart opp</BadgeText>
            )}
            {isActive && !isDue && !isOverdue && (
              <BadgeText variant="active">⏳ Sover</BadgeText>
            )}
            {!isActive && <BadgeText variant="ready">🟢 Våken</BadgeText>}
          </BadgeSection>
          <MenuContainer>
            <MenuButton
              onClick={handleMenuClick}
              title="More options"
              aria-label="Menu"
            >
              ⋮
            </MenuButton>
            {showMenu && (
              <DropdownMenu>
                <MenuItem onClick={handleEdit}>Rediger</MenuItem>
                <MenuItem className="danger" onClick={handleDelete}>
                  Slett
                </MenuItem>
              </DropdownMenu>
            )}
          </MenuContainer>
        </Header>

        {isActive && (
          <TimerDisplay>
            {isOverdue ? (
              <Timer $isOverdue>{over > 0 ? fmtDur(over) : "0:00"} OVER</Timer>
            ) : (
              <Timer>{fmtDur(remaining)}</Timer>
            )}
          </TimerDisplay>
        )}

        {isActive ? (
          <Timeline>
            Skal opp:
            <TimelineTime>{fmtTime(child.wakeAtTs)}</TimelineTime>
          </Timeline>
        ) : (
          <MaxNap>{child.maxMinutes} min max</MaxNap>
        )}
        {!isActive && lastLog && (
          <History>
            Siste: {fmtRange(lastLog.start, lastLog.end)} (
            {fmtDurShort(lastLog.durMs)})
          </History>
        )}
      </MetaSection>

      <ActionsSection>
        {!isActive && (
          <PrimaryActions>
            <StartButton onClick={onStart} className="primary">
              Sovnet nå
            </StartButton>
            <ManualButton onClick={onManual} title="Manuell start">
              Manuell
            </ManualButton>
          </PrimaryActions>
        )}
        {isActive && (
          <StopButton
            onClick={onStop}
            className={isOverdue ? "urgent" : "warning"}
          >
            Våknet
          </StopButton>
        )}
      </ActionsSection>
    </ChildRowContainer>
  );
}
