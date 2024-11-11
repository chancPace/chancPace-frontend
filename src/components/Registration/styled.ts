import styled from 'styled-components';

export const RegistrationStyled = styled.div`
  p {
    font-size: 25px;
    margin-bottom: 20px;
  }
  .form {
    .ant-form-item-label {
      text-align: left;
    }
    .ant-form-item-control {
      text-align: left;
    }
    .ant-btn {
      width: 100%;
    }
    .btn-box {
      display: flex;
      justify-content: center;
      width: 100%;
      span {
        padding: 15px 50px;
      }
    }
    .ant-input {
      width: 100%;
    }
  }
  .custom-textarea {
    resize: none;
  }
  .ant-input-number{
    width: 100%;
  }
`;
