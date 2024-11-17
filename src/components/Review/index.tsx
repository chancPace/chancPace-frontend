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
  const [reviews, setReviews] = useState<any>([]);
  const [tableData, setTableData] = useState<any[]>([]);
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
      filters: [
        { text: '1점', value: 1 },
        { text: '2점', value: 2 },
        { text: '3점', value: 3 },
        { text: '4점', value: 4 },
        { text: '5점', value: 5 },
      ],
      filterSearch: true,
      onFilter: (value: any, record: any) => Number(record.reviewRating) == value,
      render: (value: number) => <Rate disabled value={value} />,
      sorter: (a: any, b: any) => Number(a.reviewRating) - Number(b.reviewRating),
    },
    {
      title: '작성일자',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Date) => dayjs(createdAt).format('YYYY-MM-DD'),
      sorter: (a?: any, b?: any) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
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
