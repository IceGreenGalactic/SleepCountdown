import styled from "styled-components";
import { spacing, colors } from "../theme";

export const FormWrapper = styled.div`
  margin-bottom: 0;
`;

export const ToggleButton = styled.button`
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

export const FormContent = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
`;

export const Hint = styled.p`
  color: ${colors.muted};
  margin-top: ${spacing.md};
  margin-bottom: 0;
  font-size: 12px;
  line-height: 1.4;
`;
