import { ReviewStyled } from './styled';
import { Rate, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { getMySpace } from '@/pages/api/spaceApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { SpaceType } from '@/types';
import dayjs from 'dayjs';
import router from 'next/router';

const ReviewListPage = () => {
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const [reviews, setReviews] = useState<any>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    const fetchReview = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const filteredData = response.data?.filter((space: SpaceType) => space.reviews && space.reviews.length > 0);
          setReviews(filteredData);

          const tableFormattedData = filteredData.flatMap((space: any) =>
            space.reviews.map((review: any) => ({
              spaceName: space.spaceName,
              spaceLocation: space.spaceLocation,
              reviewStatus: review.reviewStatus,
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
      title: '리뷰 상태',
      dataIndex: 'reviewStatus',
      filters: [
        { text: '미삭제', value: 'AVAILABLE' },
        { text: '삭제', value: 'UNAVAILABLE' },
      ],
      onFilter: (value: any, record: any) => record.reviewStatus == value,
      render: (reviewStatus: string) =>
        reviewStatus === 'AVAILABLE' ? <Tag color="blue">미삭제</Tag> : <Tag color="red">삭제</Tag>,
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
      render: (_: any, record: any) => (
        <a onClick={() => router.push(`/review/reviewdetail/${record.reviewId}`)}>상세 보기</a>
      ),
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
