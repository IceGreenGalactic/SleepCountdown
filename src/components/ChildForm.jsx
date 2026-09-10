import { useState, useEffect } from "react";
import styled from "styled-components";
import { spacing, colors } from "../theme";

const FormWrapper = styled.div`
  margin-bottom: 0;
`;

const ToggleButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: ${({ $isOpen }) => ($isOpen ? spacing.md : 0)};
  font-weight: 600;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: ${colors.accent};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(14, 165, 233, 0.18);
    border-color: rgba(14, 165, 233, 0.5);
  }
`;

const FormContent = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

const Hint = styled.p`
  color: ${colors.muted};
  margin-top: ${spacing.md};
  margin-bottom: 0;
  font-size: 12px;
  line-height: 1.4;
`;

export default function ChildForm({
  onSubmit,
  onCancel,
  initialName = "",
  initialMinutes = "",
  isEditing = false,
}) {
  const [isFormOpen, setIsFormOpen] = useState(isEditing);
  const [name, setName] = useState(initialName);
  const [maxMinutes, setMaxMinutes] = useState(initialMinutes);

  useEffect(() => {
    setName(initialName);
    setMaxMinutes(initialMinutes);
    if (isEditing) {
      setIsFormOpen(true);
    }
  }, [initialName, initialMinutes, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !maxMinutes) return;
    onSubmit(name, maxMinutes);
    setName("");
    setMaxMinutes("");
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    if (isEditing) {
      onCancel();
    }
    setName("");
    setMaxMinutes("");
    setIsFormOpen(false);
  };

  return (
    <FormWrapper>
      <ToggleButton
        type="button"
        $isOpen={isFormOpen}
        onClick={() => setIsFormOpen(!isFormOpen)}
      >
        <span>{isFormOpen ? "➖" : "➕"}</span>
        <span>{isEditing ? "Rediger barn" : "Legg til barn"}</span>
      </ToggleButton>

      <FormContent $isOpen={isFormOpen}>
        <Form onSubmit={handleSubmit}>
          <label>
            Navn
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="F.eks. Nora"
              autoFocus={isFormOpen}
            />
          </label>

          <label>
            Maks sovetid (min)
            <input
              type="number"
              value={maxMinutes}
              onChange={(e) => setMaxMinutes(e.target.value)}
              required
              min="1"
              step="1"
              placeholder="F.eks. 60"
            />
          </label>

          <Hint>
            💡 Tips: "Maks sovetid" er slik foreldrene ønsker. Du kan alltid
            avslutte tidligere.
          </Hint>

          <ButtonGroup>
            <button type="submit" className="primary">
              {isEditing ? "Oppdater" : "Lagre"}
            </button>
            {(isEditing || isFormOpen) && (
              <button type="button" className="ghost" onClick={handleCancel}>
                Avbryt
              </button>
            )}
          </ButtonGroup>
        </Form>
      </FormContent>
    </FormWrapper>
  );
}
