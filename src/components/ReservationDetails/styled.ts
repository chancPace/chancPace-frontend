import styled from 'styled-components';

export const ReservationDetailsStyled = styled.div`
  .top {
    display: flex;
    justify-content: space-between;
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
  p {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;
