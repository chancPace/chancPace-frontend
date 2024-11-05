import { getOnePayment } from '@/pages/api/paymentApit';
import { ReservationDetailsStyled } from './styled';
import { Button, Descriptions, Input, message, Modal } from 'antd';
import type { DescriptionsProps, RadioChangeEvent } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
interface ReservationDetailsProps {
  spaceName: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  price: number;
  paymentMethod: string;
  payDate: string;
  cardNumber: string;
  suppliedPrice: number;
  vat: number;
  paymentKey: string;
}
const reservationdetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState<ReservationDetailsProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 상태
  const [cancelReason, setCancelReason] = useState(''); // 취소 이유 상태
  // console.log(details,'디테일스')
  // console.log(id, '페이먼트아이디');
  useEffect(() => {
    console.log('라우터 준비 상태:', router.isReady); // router.isReady 상태 확인
    console.log('paymentId:', id); // paymentId 값 확인

    const fetchDetails = async () => {
      if (id) {
        try {
          const response = await getOnePayment(Number(id));
          const payDate = response.data.createdAt.split('T')[0];

          console.log(response, '데이터터터ㅓ터터텉');
          setDetails({
            spaceName: response.data.Booking.Space.spaceName,
            userName: response.data.User.userName,
            userEmail: response.data.User.email,
            date: response.data.Booking.startDate,
            time: `${response.data.Booking.startTime}:00 - ${response.data.Booking.endTime}:00`,
            paymentMethod: response.data.paymentMethod,
            cardNumber: response.data.cardNumber,
            price: response.data.paymentPrice,
            payDate,
            suppliedPrice: response.data.suppliedPrice,
            vat: response.data.vat,
            paymentKey: response.data.paymentKey, // 추가: paymentKey 필드
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

  const handleConfirmCancel = () => {
    message.info('개발 중입니다');
    handleCancel(); // 모달 닫기
  };

  return (
    <ReservationDetailsStyled>
      <p>예약 상세조회</p>
      <br />
      <br />
      <Descriptions bordered>
        <Descriptions.Item label="예약자">
          {details?.userName}
        </Descriptions.Item>
        <Descriptions.Item label="예약자이메일">
          {details?.userEmail}
        </Descriptions.Item>
        <Descriptions.Item label="공간이름">
          {details?.spaceName}
        </Descriptions.Item>
        <Descriptions.Item label="예약일">{details?.date}</Descriptions.Item>
        <Descriptions.Item label="예약시간">{details?.time}</Descriptions.Item>
        <Descriptions.Item label="결제방법">
          {details?.paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="카드">
          {details?.cardNumber}
        </Descriptions.Item>
        <Descriptions.Item label="결제일">{details?.payDate}</Descriptions.Item>
        <Descriptions.Item label="공급가">
          {details?.suppliedPrice.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="공급가">
          {details?.vat.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="예약금액">
          {details?.price.toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <br />
      <div className="btn-box">
        <Button onClick={showCancelModal}>취소</Button>
      </div>
      <Modal
        title="결제 취소"
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
