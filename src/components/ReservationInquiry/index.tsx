import { Button, Form, Input } from 'antd';
import { ReservationInquiryStyled } from './styled';
import { DatePicker } from 'antd';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Link from 'next/link';
const { RangePicker } = DatePicker;
interface DataType {
  key: React.Key;
  name: string;
  date: string;
  time: string;
  personnel: string;
  request: string;
  state: string;
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
  {
    key: '1',
    name: 'test1',
    date: '2024-10-28',
    time: '12:00 - 15:00',
    personnel: '5',
    request: '요청사항없음',
    state: '미승인',
  },
  {
    key: '2',
    name: 'test2',
    date: '2024-10-28',
    time: '12:00 - 15:00',
    personnel: '5',
    request: '요청사항없음',
    state: '승인',
  },
];
const ReservationInquiry = () => {
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
