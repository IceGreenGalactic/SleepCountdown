import styled from "styled-components";
import { colors, spacing, breakpoints, shadowDialog } from "../theme";

export default styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.overlay};
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .dialog-content {
    position: relative;
    background: ${colors.card};
    border: 1px solid ${colors.border};
    border-radius: 16px;
    padding: 18px 16px;
    width: 100%;
    max-width: 400px;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: ${shadowDialog};
    color: ${colors.text};
  }

  .dialog-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent !important;
    border: 0 !important;
    color: ${colors.muted};
    font-size: 20px;
    line-height: 1;
    padding: 6px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease;
  }

  .dialog-close:hover {
    background: ${colors.borderSoft} !important;
  }

  form {
    h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
    }

    label {
      display: block;
      margin-bottom: 14px;
      font-size: 14px;
    }

    input {
      margin-top: 6px;
    }
  }

  .button-group {
    display: flex;
    gap: ${spacing.sm};
    margin-top: ${spacing.lg};

    button {
      flex: 1;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    .dialog-content {
      width: calc(100% - ${spacing.lg});
      margin: ${spacing.md};
    }
  }
`;
