import styled from "styled-components";
import { spacing, colors } from "../theme";

export const FAQWrapper = styled.div`
  details {
    cursor: pointer;
  }

  summary {
    font-weight: 600;
    font-size: 15px;
    color: ${colors.text};
    user-select: none;
    padding: 4px 0;

    &:hover {
      color: ${colors.accent};
    }
  }

  summary::-webkit-details-marker {
    color: ${colors.accent};
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: ${spacing.xl};
    margin: ${spacing.lg} 0 0 0;
    padding-left: 0;
    list-style: none;
  }

  li {
    color: ${colors.text};
    line-height: 1.5;
    font-size: 14px;

    strong {
      color: ${colors.accent};
    }

    code {
      background: ${colors.accentSoft};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: "Courier New", monospace;
      font-size: 12px;
      color: ${colors.accent};
    }
  }

  button {
    margin-top: ${spacing.md};
    display: block;
  }
`;
