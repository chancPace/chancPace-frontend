import styled from 'styled-components';

const SpaceDetailStyled = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
  .buttonWrap {
    display: flex;
    justify-content: right;
    margin: ${({ theme }) => theme.spacing.md} 0;
    gap: 20px;
  }
`;

export default SpaceDetailStyled;
