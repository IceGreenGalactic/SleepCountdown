import styled from "styled-components";
import { colors, spacing, shadow, breakpoints } from "../theme";

export default styled.div`
  background: ${colors.card};
  border: 1px solid ${colors.warn};
  border-radius: 14px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  box-shadow: ${shadow};

  > div:first-child {
    margin-bottom: ${spacing.md};
    color: ${colors.text};
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: ${spacing.sm};
    flex-wrap: wrap;
  }

  .actions button {
    flex: 1;
    min-width: 120px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    .actions {
      flex-direction: column;
    }

    .actions button {
      width: 100%;
    }
  }
`;
