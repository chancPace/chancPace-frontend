import { useRouter } from 'next/router';
import { Descriptions, Rate } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getOnePayment } from '@/pages/api/paymentApi';
import ReviewDetailStyled from './style';

const ReviewDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const paymentId = Number(id);
  const [data, setData] = useState<any>();

  const fetchPaymentData = async () => {
    try {
      const response = await getOnePayment(paymentId);
      const result = response.data;
      setData(result);
    } catch (error) {
      console.log('결제 1개', error);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const items = [
    {
      key: '1',
      label: '공간명',
      children: data?.spaceName,
    },
    {
      key: '2',
      label: '공간 위치',
      children: data?.spaceLocation,
    },
    {
      key: '3',
      label: '리뷰 작성자',
      children: data?.review,
    },
    {
      key: '4',
      label: '리뷰 내용',
      children: data?.reviewComment,
    },
    {
      key: '5',
      label: '별점',
      children: data?.reviewRating,
    },
    {
      key: '6',
      label: '작성일자',
      children: `${dayjs(data?.createdAt).format('YYYY-MM-DD')}`,
    },
  ];

  return (
    <ReviewDetailStyled>
      <p>리뷰 상세 정보</p>
      <Descriptions bordered items={items} />
    </ReviewDetailStyled>
  );
};

export default ReviewDetailPage;
