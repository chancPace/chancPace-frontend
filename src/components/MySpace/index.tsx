import { useEffect, useState } from 'react';
import { MySpaceStyled } from './styled';
import { Space, Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';
import { getMySpace,} from '@/pages/api/spaceApi';
import { SpaceType } from '@/types';
const { Column } = Table;

const MySpace = () => {
  const router = useRouter();
  const [space, setSpace] = useState([]);
  console.log(space, '스페이스스');
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴

  const handleEdit = (spaceId: number) => {
    router.push({
      pathname: '/registration', // 경로 설정
      query: { spaceId }, // spaceId를 쿼리로 전달
    });
  };
  useEffect(() => {
    const fetchSpace = async () => {
      if (userId !== null) {
        try {
          const response = await getMySpace(userId);
          const openSpace = response?.data?.filter(
            (x: SpaceType, i: number) => {
              return x.isOpen === true;
            }
          );
          setSpace(openSpace);
        } catch (error) {
          console.error('공간을 불러오지 못했습니다.', error);
        }
      }
    };
    fetchSpace();
  }, [userId]);

  return (
    <MySpaceStyled>
      <Table<SpaceType> dataSource={space} rowKey="spaceId">
        <Column title="공간 번호" dataIndex="id" key="id" />
        <Column title="공간 이름" dataIndex="spaceName" key="spaceName" />
        <Column
          title="등록일"
          dataIndex="createdAt"
          key="createdAt"
          render={(createdAt: string) =>
            new Date(createdAt).toLocaleDateString()
          }
        />
        <Column title="주소" dataIndex="spaceLocation" key="spaceLocation" />
        <Column
          title="영업시간"
          key="spaceTime"
          dataIndex="spaceTime"
          render={(_, record) => {
            return `${record?.businessStartTime}:00 - ${record.businessEndTime}:00`;
          }}
        />
        <Column
          title="금액/시간당"
          dataIndex="spacePrice"
          key="spacePrice"
          render={(price: number) => price.toLocaleString()}
        />
        <Column
          title="할인금액/시간당"
          dataIndex="discount"
          key="discount"
          render={(discount: number) => discount.toLocaleString()}
        />
        <Column
          title="상태"
          dataIndex="spaceStatus"
          key="spaceStatus"
          render={(spaceStatus: string) =>
            spaceStatus === 'AVAILABLE' ? '승인 완료' : '승인 미완료'
          }
        />
        <Column
          title="Action"
          key="action"
          render={(_: any, record) => (
            <Space size="middle">
              <a onClick={() => handleEdit(record.id)}>수정</a>
              <a onClick={() => handleEdit(record.id)}>삭제</a>
            </Space>
          )}
        />
      </Table>
    </MySpaceStyled>
  );
};
export default MySpace;
