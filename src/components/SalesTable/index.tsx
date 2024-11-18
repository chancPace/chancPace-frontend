import { DataType } from '@/types';
import { Table, TableColumnsType, Tag } from 'antd';
import dayjs from 'dayjs';
import router from 'next/router';
import { SalesTableStyled } from './style';

const SalesTable = ({ filteredData }: { filteredData: any[] }) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: '결제일',
      dataIndex: 'date',
      render: (value) => dayjs(value).format('YYYY-MM-DD'),
      sorter: (a?: any, b?: any) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    },
    {
      title: '공간명',
      dataIndex: 'spaceName',
    },
    {
      title: '매출액',
      dataIndex: 'totalAmount',
      render: (value) => value?.toLocaleString() + '원',
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
    },
    {
      title: '수수료',
      dataIndex: 'feeAmount',
      render: (value) => value?.toLocaleString() + '원',
      sorter: (a: any, b: any) => a.feeAmount - b.feeAmount,
    },
    {
      title: '정산액',
      dataIndex: 'settlementAmount',
      render: (value) => value?.toLocaleString() + '원',
      sorter: (a: any, b: any) => a.settlementAmount - b.settlementAmount,
    },
    {
      title: '결제 상태',
      dataIndex: 'bookingStatus',
      filters: [
        { text: '결제 완료', value: 'COMPLETED' },
        { text: '결제 취소', value: 'CANCELLED' },
      ],
      onFilter: (value: any, record: any) => record.paymentStatus == value,
      render: (paymentStatus: string) =>
        paymentStatus === 'COMPLETED' ? <Tag color="blue">결제 완료</Tag> : <Tag color="red">결제취소</Tag>,
    },
    {
      title: '상세 페이지',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <a onClick={() => router.push(`/sales/details/${record.paymentId}`)}>상세 보기</a>
      ),
    },
  ];
  return (
    <SalesTableStyled>
      <p>매출 상세</p>
      <Table<DataType> columns={columns} dataSource={filteredData} />
    </SalesTableStyled>
  );
};

export default SalesTable;
