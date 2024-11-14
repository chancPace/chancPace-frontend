import { DataType } from '@/types';
import { Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import router from 'next/router';

const SalesTable = ({ filteredData }: { filteredData: any[] }) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: '결제일',
      dataIndex: 'date',
      render: (value) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: '공간명',
      dataIndex: 'spaceName',
    },
    {
      title: '매출액',
      dataIndex: 'totalAmount',
      render: (value) => value.toLocaleString(),
    },
    {
      title: '수수료',
      dataIndex: 'feeAmount',
      render: (value) => value.toLocaleString(),
    },
    {
      title: '정산액',
      dataIndex: 'settlementAmount',
      render: (value) => value.toLocaleString(),
    },
    {
      title: '상세 페이지',
      dataIndex: 'action',
      render: (_: any, record: any) => (
        <a onClick={() => router.push(`/sales/details?id=${record.paymentId}`)}>상세 보기</a>
      ),
    },
  ];
  return <Table<DataType> columns={columns} dataSource={filteredData} />;
};

export default SalesTable;
