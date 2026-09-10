import styled from "styled-components";
import { colors, spacing } from "../theme";

/**
 * Shared, reusable styled components used across multiple components
 */

export const Button = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: ${colors.text};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: ${colors.accent};
    background: rgba(14, 165, 233, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background: ${colors.accent};
    border-color: ${colors.accent};
    color: #000;
    font-weight: 600;
  }

  &.primary:hover:not(:disabled) {
    background: #0d96d9;
  }

  &.danger {
    color: ${colors.danger};
  }

  &.danger:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
    border-color: ${colors.danger};
  }

  &.ghost {
    background: transparent;
    border: 1px solid transparent;
  }

  &.ghost:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: ${colors.text};
  margin-top: 4px;
  font-family: inherit;
  font-size: 14px;
  min-height: 40px;

  &:focus {
    outline: none;
    border-color: ${colors.accent};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${colors.text};

  &.inline {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

export const Card = styled.section`
  background: ${colors.card};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
`;
