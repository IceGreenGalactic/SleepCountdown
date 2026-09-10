import styled from "styled-components";
import { colors, spacing, shadow } from "./theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const MainContent = styled.main`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 0 ${spacing.md};
  padding-top: ${spacing.xl};
  padding-bottom: ${spacing.lg};
  overflow-y: auto;
`;

export const Card = styled.section`
  background: ${colors.section};
  border: 1px solid ${colors.borderSoft};
  border-radius: 14px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.lg};
  box-shadow: ${shadow};
`;

export const Footer = styled.footer`
  opacity: 0.7;
  text-align: center;
  padding: ${spacing.lg};
  font-size: 12px;
  color: ${colors.muted};
`;
