import styled from 'styled-components';

export const LoginStyled = styled.div`
  margin: auto;
  height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  position: relative;
  .form {
    background-color: rgba(255, 255, 255, 0.8);
    width: 450px;
    margin: auto;
    padding: 50px;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid lightgray;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);

    span {
      font-size: 13px;
    }
    .span1 {
      display: block;
      margin-top: 10px;
    }
    z-index: 10;
  }
  .formLogo {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    text-align: center;
    color: lightgray;
    margin-bottom: 25px;
  }
`;
