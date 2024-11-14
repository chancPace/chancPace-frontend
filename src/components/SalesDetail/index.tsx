import { useRouter } from 'next/router';
import { SalesDetailStyled } from './styled';
import { useEffect, useState } from 'react';
import { getOnePayment } from '@/pages/api/paymentApi';
import { Descriptions } from 'antd';
import { Payment } from '@/types';

const SalesDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getOnePayment(Number(id));
        setDetails(response.data);
      } catch (error) {
        console.error('데이터 불러오기 실패');
      }
    };
    fetchDetail();
  }, [id]);
  const totalAmount = details ? details.paymentPrice + (details.couponPrice ?? 0) : 0;
  const feeAmount = totalAmount * 0.05;
  const settlementAmount = totalAmount - feeAmount;

  return (
    <SalesDetailStyled>
      <p>매출 상세</p>
      {details ? (
        <Descriptions bordered>
          <Descriptions.Item label="공간명">{details.booking?.space?.spaceName}</Descriptions.Item>
          <Descriptions.Item label="예약자">{details.user?.userName}</Descriptions.Item>
          <Descriptions.Item label="고객 연락처">{details.user?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="고객 결제 금액">{details.paymentPrice.toLocaleString() + '원'}</Descriptions.Item>
          <Descriptions.Item label="쿠폰 사용금액">{details.couponPrice?.toLocaleString() + '원'}</Descriptions.Item>
          <Descriptions.Item label="매출액">{totalAmount.toLocaleString() + '원'}</Descriptions.Item>
          <Descriptions.Item label="수수료">{feeAmount.toLocaleString() + '원'}</Descriptions.Item>
          <Descriptions.Item label="정산예정액">{settlementAmount.toLocaleString() + '원'}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>로딩 중...</p>
      )}
    </SalesDetailStyled>
  );
};
export default SalesDetail;
