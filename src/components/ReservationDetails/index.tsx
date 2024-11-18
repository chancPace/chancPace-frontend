import { getOnePayment, Refund } from '@/pages/api/paymentApi';
import { ReservationDetailsStyled } from './styled';
import { Button, Descriptions, Input, message, Modal, Tag } from 'antd';
import type { DescriptionsProps, RadioChangeEvent } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
interface ReservationDetailsProps {
  spaceName?: string;
  userName?: string;
  userEmail?: string;
  date?: string;
  time?: string;
  price?: number;
  paymentMethod?: string;
  payDate?: string;
  cardNumber?: string;
  suppliedPrice?: number;
  vat?: number;
  paymentKey?: string;
  isBooking?: string;
}
const reservationdetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState<ReservationDetailsProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        try {
          const response = await getOnePayment(Number(id));
          const payDate = response.data.createdAt.split('T')[0];
          setDetails({
            spaceName: response.data.booking.space.spaceName,
            userName: response.data.user.userName,
            userEmail: response.data.user.email,
            date: response.data.booking.startDate,
            isBooking: response.data.booking.bookingStatus,
            time: `${response.data.booking.startTime}:00 - ${response.data.booking.endTime}:00`,
            paymentMethod: response.data.paymentMethod,
            cardNumber: response.data.cardNumber,
            price: response.data.paymentPrice,
            payDate,
            suppliedPrice: response.data.suppliedPrice,
            vat: response.data.vat,
            paymentKey: response.data.paymentKey,
          });
        } catch (error) {
          console.error('결제 상세 정보 불러오기 실패:', error);
        }
      }
    };

    fetchDetails();
  }, [id]);

  const showCancelModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    try {
      const bookingId = id;
      const cancelReason = '호스트 요청에 따른 취소';
      await Refund(Number(bookingId), cancelReason);
      message.success('예약이 취소되었습니다');
      setIsModalVisible(false);
      router.push('/reservation');
    } catch (error) {
      message.error('예약 취소 실패');
      console.error('예약취소실패', error);
    }
  };

  return (
    <ReservationDetailsStyled>
      <div className="top">
        <p>예약 상세조회</p>
        {details?.isBooking === 'COMPLETED' ? (
          <div className="btn-box">
            <Button onClick={showCancelModal}>취소</Button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Descriptions bordered>
        <Descriptions.Item label="예약자">{details?.userName}</Descriptions.Item>
        <Descriptions.Item label="예약자 이메일">{details?.userEmail}</Descriptions.Item>
        <Descriptions.Item label="공간 이름">{details?.spaceName}</Descriptions.Item>
        <Descriptions.Item label="예약 일자">{details?.date}</Descriptions.Item>
        <Descriptions.Item label="예약 시간">{details?.time}</Descriptions.Item>
        <Descriptions.Item label="예약 상태">
          {details?.isBooking === 'COMPLETED' ? <Tag color="blue">예약 완료</Tag> : <Tag color="red">예약 취소</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="결제 방법">{details?.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="카드">
          {details?.cardNumber === 'UNKNOWN' ? '-' : details?.cardNumber}
        </Descriptions.Item>
        <Descriptions.Item label="결제 일자">{details?.payDate}</Descriptions.Item>
        <Descriptions.Item label="공급가">{details?.suppliedPrice?.toLocaleString() + '원'}</Descriptions.Item>
        <Descriptions.Item label="부가세">{details?.vat?.toLocaleString() + '원'}</Descriptions.Item>
        <Descriptions.Item label="예약 금액">{details?.price?.toLocaleString() + '원'}</Descriptions.Item>
      </Descriptions>

      <Modal
        title="예약 취소"
        visible={isModalVisible}
        onOk={handleConfirmCancel}
        onCancel={handleCancel}
        okText="확인"
        cancelText="취소"
      >
        <Input.TextArea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          rows={4}
          placeholder="취소 이유를 입력하세요"
        />
      </Modal>
    </ReservationDetailsStyled>
  );
};
export default reservationdetails;
