import { useRouter } from 'next/router';
import { Button, Descriptions, message, Modal, Rate, Tag } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ReviewDetailStyled from './style';
import { getOneReview, updateRatingBySpace, updateReview } from '@/pages/api/reviewApi';
const { confirm } = Modal;

const ReviewDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const reviewId = Number(id);
  const [data, setData] = useState<any>();

  const fetchRevieData = async () => {
    if (reviewId) {
      try {
        const response = await getOneReview(reviewId);
        const result = response.data;
        setData(result);
      } catch (error) {
        console.log('리뷰', error);
      }
    }
  };

  useEffect(() => {
    fetchRevieData();
  }, [reviewId]);

  //삭제버튼 클릭시 삭제 확인하는 모달 창 띄우기
  const showDeleteConfirm = () => {
    confirm({
      title: '리뷰를 삭제하시겠습니까?',
      content: '한 번 삭제된 리뷰는 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        handleDeleteClick();
      },
    });
  };

  const handleDeleteClick = async () => {
    const reviewData = {
      reviewId,
      reviewComment: data.reviewComment,
      reviewRating: null,
      reviewStatus: 'UNAVAILABLE',
    };
    try {
      const result = await updateReview(reviewId, reviewData);
      if (result) {
        message.success('리뷰가 성공적으로 삭제되었습니다.');
        const updateResult = await updateRatingBySpace(data.spaceId);
      }
    } catch (error) {
      message.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const items = [
    {
      key: '1',
      label: '공간명',
      children: data?.space?.spaceName,
    },
    {
      key: '2',
      label: '공간 위치',
      children: data?.space?.spaceLocation,
    },
    {
      key: '3',
      label: '작성일자',
      children: `${dayjs(data?.createdAt).format('YYYY-MM-DD')}`,
    },
    {
      key: '4',
      label: '리뷰 작성자',
      children: data?.user?.userName,
    },
    {
      key: '5',
      label: '리뷰 내용',
      children: data?.reviewComment,
    },

    {
      key: '6',
      label: '리뷰 상태',
      children: data?.reviewStatus === 'AVAILABLE' ? <Tag color="blue">미삭제</Tag> : <Tag color="red">삭제</Tag>,
    },
    {
      key: '7',
      label: '별점',
      children: <Rate disabled value={data?.reviewRating} />,
    },
  ];

  return (
    <ReviewDetailStyled>
      <div className="top">
        <p>리뷰 상세 정보</p>
        {data?.reviewStatus === 'AVAILABLE' ? <Button onClick={showDeleteConfirm}>삭제</Button> : <></>}
      </div>
      <Descriptions bordered items={items} />
    </ReviewDetailStyled>
  );
};

export default ReviewDetailPage;
