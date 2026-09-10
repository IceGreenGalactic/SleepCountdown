import { createGlobalStyle } from "styled-components";
import { colors, breakpoints } from "./theme";

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
    margin: 0;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: linear-gradient(180deg, #0a0f25, #0b132b 50%, #0a0f25);
    color: ${colors.text};
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  main {
    flex: 1;
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 18px;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
  }

  label.inline {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  input {
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
  }

  input:focus {
    outline: none;
    border-color: ${colors.accent};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1);
  }

  button {
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
  }

  button:hover:not(:disabled) {
    border-color: ${colors.accent};
    background: rgba(14, 165, 233, 0.1);
  }

  button.primary {
    background: ${colors.accent};
    border-color: ${colors.accent};
    color: #000;
    font-weight: 600;
  }

  button.primary:hover:not(:disabled) {
    background: #0d96d9;
  }

  button.danger {
    color: ${colors.danger};
  }

  button.danger:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
    border-color: ${colors.danger};
  }

  button.ghost {
    background: transparent;
    border: 1px solid transparent;
  }

  button.ghost:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  button.danger {
    border-color: ${colors.danger};
    color: ${colors.danger};
  }

  button.warn {
    border-color: ${colors.warn};
    color: ${colors.warn};
  }

  button.ok {
    border-color: ${colors.ok};
    color: ${colors.ok};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes bgPulse {
    0%, 100% {
      background-size: 100% 100%;
    }
    50% {
      background-size: 105% 105%;
    }
  }

  @keyframes bgPulseFast {
    0%, 100% {
      background-size: 100% 100%;
    }
    50% {
      background-size: 110% 110%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    body {
      font-size: 14px;
    }
  }
`;
