import styled from 'styled-components';

export const SalesTableStyled = styled.div`
  p {
    margin: ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;
