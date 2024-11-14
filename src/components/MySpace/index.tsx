import { useEffect, useState } from 'react';
import { MySpaceStyled } from './styled';
import { Button, Space, Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';
import { getMySpace } from '@/pages/api/spaceApi';
import { SpaceType } from '@/types';
import Link from 'next/link';
const { Column } = Table;

const MySpace = () => {
  const router = useRouter();
  const [space, setSpace] = useState([]);
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);

  useEffect(() => {
    const fetchSpace = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const openSpace = response?.data?.filter((x: SpaceType, i: number) => {
            return x.isOpen === true;
          });
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
      <div className="top">
        <p>내 공간 목록</p>
        <Link href="registration">
          <Button type="primary" className="register">
            등록
          </Button>
        </Link>
      </div>
      <Table<SpaceType> dataSource={space} rowKey="spaceId">
        <Column title="공간 이름" dataIndex="spaceName" key="spaceName" />
        <Column
          title="등록일"
          dataIndex="createdAt"
          key="createdAt"
          render={(createdAt: string) => new Date(createdAt).toLocaleDateString()}
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
          render={(price: number) => `${price.toLocaleString()}원`}
        />
        <Column
          title="할인금액/시간당"
          dataIndex="discount"
          key="discount"
          render={(discount: number) => `${discount.toLocaleString()}원`}
        />
        <Column
          title="상태"
          dataIndex="spaceStatus"
          key="spaceStatus"
          render={(spaceStatus: string) => (spaceStatus === 'AVAILABLE' ? '승인 완료' : '승인 미완료')}
        />
        <Column
          title="상페 페이지"
          key="action"
          render={(_: any, record) => (
            <Space size="middle">
              <a onClick={() => router.push(`/myspace/spacedetail/${record.id}`)}>상세 보기</a>
            </Space>
          )}
        />
      </Table>
    </MySpaceStyled>
  );
};
export default MySpace;
