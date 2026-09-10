import ChildRow from "./ChildRow";
import styled from "styled-components";
import { colors } from "../theme";

const ListContainer = styled.div``;

const EmptyState = styled.p`
  color: ${colors.muted};
  margin-top: 8px;
  margin-bottom: 0;
  font-size: 14px;
`;

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

  const sorted = [...children].sort((a, b) => {
    const aIsSleeping = Boolean(a.napStartTs && a.wakeAtTs);
    const bIsSleeping = Boolean(b.napStartTs && b.wakeAtTs);

    // Barn som ikke sover skal stå øverst
    if (!aIsSleeping && bIsSleeping) return -1;
    if (aIsSleeping && !bIsSleeping) return 1;

    // Hvis begge sover:
    // den som skal vekkes først står øverst
    if (aIsSleeping && bIsSleeping) {
      return a.wakeAtTs - b.wakeAtTs;
    }

    // Hvis ingen av dem sover:
    // sorter alfabetisk
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
