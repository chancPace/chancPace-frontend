import styled from 'styled-components';

const ReviewDetailStyled = styled.div`
  p {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  .buttonWrap {
    display: flex;
    justify-content: right;
    gap: 20px;
  }
`;

export default ReviewDetailStyled;
