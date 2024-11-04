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
const { RangePicker } = DatePicker;
interface DataType {
  key: React.Key;
  bookingStatus: string;
  createdAt: string;
  endTime:number;
  id:number;
  spaceId:number;
  startData:string;
  startTime:number;
  updatedAt:string;
  userId:number
}

const columns: TableColumnsType<DataType> = [
  {
    title: '예약자',
    dataIndex: 'name',
    width: '10%',
    render: (text, record) => (
      <Link href={`/reservation/details?id=${record.key}`}>{text}</Link>
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
    title: '인원',
    dataIndex: 'personnel',
  },
  {
    title: '요청사항',
    dataIndex: 'request',
  },
  {
    title: '상태',
    dataIndex: 'state',
  },
];

const data: DataType[] = [
  // {
  //   key: '1',
  //   name: 'test1',
  //   date: '2024-10-28',
  //   time: '12:00 - 15:00',
  //   personnel: '5',
  //   request: '요청사항없음',
  //   state: '미승인',
  // },
  // {
  //   key: '2',
  //   name: 'test2',
  //   date: '2024-10-28',
  //   time: '12:00 - 15:00',
  //   personnel: '5',
  //   request: '요청사항없음',
  //   state: '승인',
  // },
];

const ReservationInquiry = () => {
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴
  // console.log(userId, '유저아이디');
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  // console.log(data, '데이터터터ㅓ터텉');
  useEffect(() => {
    if (userId !== null) {
      const fetchReservation = async (userId: number) => {
        try {
          const response = await getMySpace(userId);
          console.log(response.data, '리스펀스');
          const reservation = response


        } catch (error) {
          console.error('예약 데이터를 불러오는 데 실패했습니다:', error);
        }
      };
      fetchReservation(userId);
    }
  }, [userId]);

  return (
    <ReservationInquiryStyled>
      <Form className="search-section">
        <RangePicker />
        <Input />
        <Button>검색</Button>
      </Form>
      <div className="inquiry-section">
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </ReservationInquiryStyled>
  );
};
export default ReservationInquiry;
