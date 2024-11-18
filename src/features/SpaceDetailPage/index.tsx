import { useRouter } from 'next/router';
import { Button, Descriptions, message, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import SpaceDetailStyled from './style';
import { getOneSpace, stopSpace, deleteSpace } from '@/pages/api/spaceApi';
import { Space, User } from '@/types';
import dayjs from 'dayjs';

const SpaceDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const spaceId = String(id);
  const [data, setData] = useState<Space>();

  const fetchSpaceData = async (spaceId: string) => {
    try {
      const response = await getOneSpace(spaceId);
      const result = response.data;
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.log('공간1개', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSpaceData(spaceId);
    }
  }, [id]);

  const items: any = [
    {
      key: '1',
      label: '공간명',
      children: data?.spaceName,
    },
    {
      key: '2',
      label: '전화번호',
      children: `${data?.spaceAdminPhoneNumber?.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3')}`,
    },
    {
      key: '3',
      label: '주소',
      children: data?.spaceLocation,
      span: 2,
    },
    {
      key: '4',
      label: '계좌 정보',
      children: (
        <>
          {/* <span style={{ display: 'inline-block', marginRight: 30 }}>{data?.bankAccountName}</span>
          <span style={{ display: 'inline-block', marginRight: 30 }}> {data?.bankAccountNumber}</span>
          <span style={{ display: 'inline-block' }}>{data?.bankAccountOwner}</span> */}
          추후 등록!!!!
        </>
      ),
      span: 2,
    },
    {
      key: '5',
      label: '등록일',
      children: `${dayjs(data?.createdAt).format('YYYY-MM-DD')}`,
    },
    {
      key: '6',
      label: '관리자 승인',
      children:
        data?.spaceStatus === 'AVAILABLE' ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            승인
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            미승인
          </Tag>
        ),
    },
    {
      key: '7',
      label: '운영',
      children: data?.isOpen === true ? <Tag color="blue">운영중</Tag> : <Tag color="red">미운영</Tag>,
    },
    {
      key: '8',
      label: '원가',
      children: `${data?.spacePrice?.toLocaleString()}원`,
    },
    {
      key: '9',
      label: '할인가',
      children: `${data?.discount?.toLocaleString()}원`,
    },
    {
      key: '10',
      label: '인원 추가 금액',
      children: `${data?.addPrice?.toLocaleString()}원`,
    },

    {
      key: '11',
      label: '이용 가능 인원',
      children: `${data?.minGuests}명 ~ ${data?.maxGuests}명`,
    },

    {
      key: '12',
      label: '영업 시간',
      children: `${data?.businessStartTime}시 ~ ${data?.businessEndTime}시`,
    },
    {
      key: '13',
      label: '청소시간',
      children: `${data?.cleanTime}시간`,
    },
    {
      key: '14',
      label: '평점',
      children: data?.spaceRating,
    },
    {
      key: '15',
      label: '주의사항',
      children: data?.guidelines,
    },
    {
      key: '16',
      label: '편의시설',
      children: data?.amenities,
    },
    {
      key: '17',
      label: '설명',
      children: data?.description,
    },
  ];

  return (
    <SpaceDetailStyled>
      <div className="top">
        <p>공간 상세 정보</p>
        <div className="buttonWrap">
          <div>
            <Button
              htmlType="submit"
              onClick={() => {
                router.push({
                  pathname: '/registration',
                  query: { spaceId },
                });
              }}
            >
              수정
            </Button>
          </div>
          <div>
            <Button
              className="delete"
              onClick={() => {
                Modal.confirm({
                  title: data?.isOpen === true ? '공간을 중단하시겠습니까?' : '공간을 재오픈하시겠습니까?',
                  okText: '확인',
                  cancelText: '취소',
                  onOk: async () => {
                    message.info(data?.isOpen === true ? '중단되었습니다.' : '재오픈되었습니다.');
                    const updatedData = { spaceId, isOpen: !data?.isOpen };
                    await stopSpace(updatedData);
                    router.push('/myspace');
                  },
                });
              }}
            >
              {data?.isOpen === true ? '미운영' : '운영'}
            </Button>
          </div>
          <div>
            <Button
              htmlType="submit"
              onClick={() => {
                Modal.confirm({
                  title: '공간을 삭제하시겠습니까?',
                  okText: '확인',
                  cancelText: '취소',
                  onOk: async () => {
                    message.info('삭제되었습니다.');
                    const updatedData = { spaceId, isDelete: true };
                    const stopData = { spaceId, isOpen: !data?.isOpen };
                    await deleteSpace(updatedData);
                    await stopSpace(stopData);
                    router.push('/myspace');
                  },
                });
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
      {/* <Descriptions bordered items={items} /> */}
    </SpaceDetailStyled>
  );
};

export default SpaceDetailPage;
