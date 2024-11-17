import styled from 'styled-components';

export const ReservationDetailsStyled = styled.div`
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  p {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;
