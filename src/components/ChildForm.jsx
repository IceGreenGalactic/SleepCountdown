import { useState, useEffect } from "react";
import {
  FormWrapper,
  ToggleButton,
  FormContent,
  Form,
  ButtonGroup,
  Hint,
} from "./ChildForm.styled";

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
