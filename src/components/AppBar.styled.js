import styled from 'styled-components';
import { colors, spacing } from '../theme';

export default styled.header`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md} ${spacing.lg};
  background: rgba(10, 15, 37, 0.78);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  h1 {
    margin: 0;
    font-size: 22px;
    color: ${colors.text};
  }

  .actions {
    display: flex;
    gap: ${spacing.sm};
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .actions button {
    margin: 0;
    font-size: 13px;
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: ${spacing.md};
    align-items: flex-start;

    .actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;
