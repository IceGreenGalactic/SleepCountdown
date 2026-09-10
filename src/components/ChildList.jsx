import ChildRow from "./ChildRow";
import { ListContainer, EmptyState } from "./ChildList.styled";

export default function ChildList({
  children,
  onEdit,
  onDelete,
  onStart,
  onStop,
  onManual,
}) {
  if (children.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          Ingen barn enda. Legg inn navn og maks sovetid over.
        </EmptyState>
      </ListContainer>
    );
  }

  const hasSleptToday = (child) => {
    const lastLog = child.logs?.[0];

    if (!lastLog?.end) return false;

    const logDate = new Date(lastLog.end);
    const today = new Date();

    return (
      logDate.getFullYear() === today.getFullYear() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getDate() === today.getDate()
    );
  };

  const sorted = [...children].sort((a, b) => {
    const aSleeping = Boolean(a.napStartTs && a.wakeAtTs);
    const bSleeping = Boolean(b.napStartTs && b.wakeAtTs);

    const aSleptToday = hasSleptToday(a);
    const bSleptToday = hasSleptToday(b);

    // 1. Barn som ikke har sovet ennå i dag
    if (!aSleeping && !aSleptToday && (bSleeping || bSleptToday)) {
      return -1;
    }

    if (!bSleeping && !bSleptToday && (aSleeping || aSleptToday)) {
      return 1;
    }

    // 2. Barn som sover nå
    if (aSleeping && !bSleeping) return -1;
    if (bSleeping && !aSleeping) return 1;

    // Begge sover: den som skal opp først øverst
    if (aSleeping && bSleeping) {
      return a.wakeAtTs - b.wakeAtTs;
    }

    // 3. Barn som allerede har sovet i dag
    if (aSleptToday && !bSleptToday) return 1;
    if (bSleptToday && !aSleptToday) return -1;

    // Samme gruppe: alfabetisk
    return a.name.localeCompare(b.name, "no");
  });

  return (
    <ListContainer>
      {sorted.map((child) => (
        <ChildRow
          key={child.id}
          child={child}
          onEdit={() => onEdit(child.id)}
          onDelete={() => onDelete(child.id)}
          onStart={() => onStart(child.id)}
          onStop={() => onStop(child.id)}
          onManual={() => onManual(child.id)}
        />
      ))}
    </ListContainer>
  );
}
