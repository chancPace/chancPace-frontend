import { Button, Form, Input } from 'antd';
import { ReservationInquiryStyled } from './styled';
import { DatePicker } from 'antd';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Link from 'next/link';
import { getMySpace } from '@/pages/api/spaceApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';

interface DataType {
  key: React.Key;
  bookingStatus: string;
  createdAt: string;
  endTime: number;
  id: number;
  spaceId: number;
  startData: string;
  startTime: number;
  updatedAt: string;
  userId: number;
  paymentId: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '순서',
    dataIndex: 'paymentId',
  },
  {
    title: '공간명',
    dataIndex: 'spaceName',
  },
  {
    title: '예약자',
    dataIndex: 'name',
    width: '10%',
    render: (text, record) => (
      <Link href={`/reservation/details?id=${record.paymentId}`}>{text}</Link>
    ),
  },
  {
    title: '방문일자',
    dataIndex: 'date',
  },
  {
    title: '방문시간',
    dataIndex: 'time',
  },
  {
    title: '전화번호',
    dataIndex: 'phoneNumber',
    width: '20%',
  },
  {
    title: '금액',
    dataIndex: 'paymentAmount',
    width: '20%',
  },
];

const ReservationInquiry = () => {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴
  // console.log(userId, '유저아이디');
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  // console.log(data, '데이터터터ㅓ터텉');
  useEffect(() => {
    if (userId !== null) {
      const fetchReservation = async (userId: number) => {
        try {
          const response = await getMySpace(userId);
          const reservations = response.data.flatMap((space: any) =>
            space.Bookings.flatMap((booking: any) =>
              booking.User?.Payments.map((payment: any) => ({
                key: booking.id,
                name: booking.User?.userName || '예약자 이름',
                date: booking.startDate,
                time: `${booking.startTime}:00 - ${booking.endTime}:00`,
                phoneNumber: booking.User?.phoneNumber || '전화번호 없음',
                bookingStatus: booking.bookingStatus,
                paymentAmount: payment.paymentPrice,
                spaceName: space.spaceName || '공간명 없음',
                paymentId: payment.id,
              }))
            )
          );
          setData(reservations);
        } catch (error) {
          console.error('예약 데이터를 불러오는 데 실패했습니다:', error);
        }
      };
      fetchReservation(userId);
    }
  }, [userId]);

  const handleRowClick = (record: DataType) => {
    router.push(`/reservation/details?id=${record.paymentId}`);
  };

  return (
    <ReservationInquiryStyled>
      <Form className="search-section">
        <Input />
        <Button>검색</Button>
      </Form>
      <div className="inquiry-section">
        <Table<DataType>
          columns={columns}
          dataSource={data}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
    </ReservationInquiryStyled>
  );
};
export default ReservationInquiry;
