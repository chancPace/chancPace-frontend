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
import { Booking, Payment, Reservation, SpaceType } from '@/types';

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
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  const [filteredData, setFilteredData] = useState<DataType[]>([]); // 검색 결과용 상태
  const [searchText, setSearchText] = useState(''); // 검색어 상태


  //내 공간의 예약가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId); // userId로 API 호출
          const transformedData = response.data
            .map((space: SpaceType) => {
              return space.bookings?.map((booking) => {
                const user = booking.user;
                const payment = user?.payments.find(
                  (p) => p.id === booking.paymentId
                );
                return {
                  key: booking.id,
                  paymentId: booking.paymentId,
                  spaceName: space.spaceName,
                  name: user?.userName,
                  date: booking.startDate,
                  time: `${booking.startTime} - ${booking.endTime}`,
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

  //검색어에 따라 데이터 필터링
  const handleSearch = () => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  //리스트 클릭 시 상세 페이지로 이동
  const handleRowClick = (record: DataType) => {
    router.push(`/reservation/details?id=${record.paymentId}`);
  };

  return (
    <ReservationInquiryStyled>
      <Form className="search-section" onFinish={handleSearch}>
        <Input
          placeholder="검색어를 입력하세요"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Button htmlType="submit">검색</Button>
      </Form>
      <div className="inquiry-section">
        <Table<DataType>
          columns={columns}
          dataSource={filteredData}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
    </ReservationInquiryStyled>
  );
};
export default ReservationInquiry;
