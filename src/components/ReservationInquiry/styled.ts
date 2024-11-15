import styled from 'styled-components';

export const ReservationInquiryStyled = styled.div`
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }

  .search-section {
    margin-bottom: 50px;
    width: 100%;
    /* background-color: gray; */
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-picker {
      width: 230px;
      margin: 10px;
    }
    .ant-input {
      width: 300px;
      margin: 10px;
    }
  }
`;
