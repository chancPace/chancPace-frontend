import { Tag } from 'antd';
import { ReservationInquiryStyled } from './styled';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { getMySpace } from '@/pages/api/spaceApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { SpaceType } from '@/types';
import dayjs from 'dayjs';

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

const ReservationInquiry = () => {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const [data, setData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const transformedData = response.data
            .map((space: SpaceType) => {
              return space.bookings?.map((booking) => {
                const user = booking.user;
                const payment = user?.payments.find((p) => p.id === booking.paymentId);
                return {
                  key: booking.id,
                  paymentId: booking.paymentId,
                  spaceName: space.spaceName,
                  name: user?.userName,
                  date: booking.startDate,
                  isBooking: booking.bookingStatus,
                  time: `${booking.startTime}:00 - ${booking.endTime}:00`,
                  phoneNumber: user?.phoneNumber,
                  paymentAmount: payment ? payment.paymentPrice : '정보 없음',
                };
              });
            })
            .flat();
          setData(transformedData);
          setFilteredData(transformedData);
        } catch (error) {
          console.error('예약 데이터 불러오기 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const columns: TableColumnsType<DataType> = [
    {
      title: '공간명',
      dataIndex: 'spaceName',
    },
    {
      title: '예약자',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: '방문일자',
      dataIndex: 'date',
      sorter: (a?: any, b?: any) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: '방문시간',
      dataIndex: 'time',
    },
    {
      title: '전화번호',
      dataIndex: 'phoneNumber',
    },
    {
      title: '금액',
      dataIndex: 'paymentAmount',
      render: (value) => `${value.toLocaleString()}원`,
      sorter: (a?: any, b?: any) => dayjs(a.paymentAmount).valueOf() - dayjs(b.paymentAmount).valueOf(),
    },
    {
      title: '예약 상태',
      dataIndex: 'isBooking',
      filters: [
        { text: '예약 완료', value: 'COMPLETED' },
        { text: '예약취소', value: 'CANCELLED' },
      ],
      onFilter: (value: any, record: any) => record.isBooking == value,
      render: (isBooking: string) =>
        isBooking === 'COMPLETED' ? <Tag color="blue">예약 완료</Tag> : <Tag color="red">예약 취소</Tag>,
    },
    {
      title: '상세 페이지',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <a onClick={() => router.push(`/reservation/details/${record.paymentId}`)}>상세 보기</a>
      ),
    },
  ];

  return (
    <ReservationInquiryStyled>
      <p>예약 목록</p>
      <Table<DataType> columns={columns} dataSource={filteredData} />
    </ReservationInquiryStyled>
  );
};
export default ReservationInquiry;
