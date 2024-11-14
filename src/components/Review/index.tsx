import { ReviewStyled } from './styled';
import { message, Modal, Rate, Table } from 'antd';
import { useEffect, useState } from 'react';
import { getMySpace } from '@/pages/api/spaceApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { SpaceType } from '@/types';
import { updateReview } from '@/pages/api/reviewApi';
import dayjs from 'dayjs';
import router from 'next/router';
const { confirm } = Modal;

const ReviewListPage = () => {
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  //리뷰데이터 저장
  const [reviews, setReviews] = useState<any>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  //리뷰 가져오기 (AVAILABLE 상태인것만)
  useEffect(() => {
    const fetchReview = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const filteredData = response.data
            .map((space: SpaceType) => ({
              ...space,
              reviews: space.reviews?.filter((review) => review.reviewStatus === 'AVAILABLE'),
            }))
            .filter((space: SpaceType) => space.reviews && space.reviews.length > 0);
          setReviews(filteredData);

          // Table에 사용할 데이터 구조로 변환
          const tableFormattedData = filteredData.flatMap((space: any) =>
            space.reviews.map((review: any) => ({
              spaceName: space.spaceName,
              spaceLocation: space.spaceLocation,
              reviewRating: review.reviewRating,
              reviewComment: review.reviewComment,
              reviewId: review.id,
              reviewerName: review.user?.userName,
              createdAt: dayjs(review.createdAt).format('YYYY-MM-DD'),
            }))
          );
          setTableData(tableFormattedData);
        } catch (error) {
          console.error('리뷰 불러오기 실패', error);
        }
      }
    };
    fetchReview();
  }, [userId]);

  //삭제버튼 클릭시 상태 변경 및 별점 null처리
  const handleDeleteClick = async (reviewId: number) => {
    const reviewData = {
      reviewComment: '',
      reviewRating: null,
      reviewStatus: 'UNAVAILABLE',
    };
    try {
      const result = await updateReview(reviewId, reviewData);
      if (result) {
        message.success('리뷰가 성공적으로 삭제되었습니다.');
      }
    } catch (error) {
      message.error('리뷰 삭제에 실패했습니다.');
    }
  };

  //삭제버튼 클릭시 삭제 확인하는 모달 창 띄우기
  const showDeleteConfirm = (reviewId: number) => {
    confirm({
      title: '리뷰를 삭제하시겠습니까?',
      content: '한 번 삭제된 리뷰는 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        handleDeleteClick(reviewId);
      },
      onCancel() {},
    });
  };

  //리스트 클릭 시 상세 페이지로 이동
  const handleRowClick = (record: any) => {
    router.push(`/review/reviewdetail/${record}`);
  };

  const columns = [
    {
      title: '공간명',
      dataIndex: 'spaceName',
      key: 'spaceName',
    },
    {
      title: '공간 위치',
      dataIndex: 'spaceLocation',
      key: 'spaceLocation',
    },
    {
      title: '리뷰 작성자',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
    },
    {
      title: '리뷰 내용',
      dataIndex: 'reviewComment',
      key: 'reviewComment',
      render: (text: string) => text || '-',
    },
    {
      title: '별점',
      dataIndex: 'reviewRating',
      key: 'reviewRating',
      render: (value: number) => <Rate disabled value={value} />,
    },
    {
      title: '작성일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '상세 페이지',
      dataIndex: 'action',
      render: (_: any, record: any) => <a onClick={() => handleRowClick(record.reviewId)}>상세 보기</a>,
    },
    {
      title: '삭제',
      key: 'delete',
      render: (_: any, record: any) => <a onClick={() => showDeleteConfirm(record.id)}>삭제하기</a>,
    },
  ];

  return (
    <ReviewStyled>
      <p>리뷰 목록</p>
      <Table columns={columns} dataSource={tableData} />
    </ReviewStyled>
  );
};
export default ReviewListPage;
