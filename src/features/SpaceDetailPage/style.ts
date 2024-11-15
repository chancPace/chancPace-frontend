import styled from 'styled-components';

const SpaceDetailStyled = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
  .buttonWrap {
    display: flex;
    justify-content: right;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: 15px;
  }
`;

export default SpaceDetailStyled;
