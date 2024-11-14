import styled from 'styled-components';

export const MySpaceStyled = styled.div`
  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    p {
      font-size: ${({ theme }) => theme.fontSizes.xl};
    }
  }
  .ant-list-item {
    height: 400px;
    .ant-card {
      height: 100%;
      .ant-card-body {
        object-fit: cover;
        height: 300px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .button-box {
          width: 100%;
          text-align: center;
          margin-top: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .trash {
            font-size: 20px;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0%, -50%);
            cursor: pointer;
          }
        }
      }
    }
  }
`;
