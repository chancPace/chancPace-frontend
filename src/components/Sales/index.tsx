import { SalesStyled } from './styled';
import { DatePicker, Table, TableColumnsType } from 'antd';
const { RangePicker } = DatePicker;
import DateRangePicker from '../DateRangePicker';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';

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
    // dataIndex: 'key',
  },
  {
    title: '예약일',
    dataIndex: 'date',
  },
  {
    title: '공간명',
    dataIndex: 'spaceName',
    // render: (text, record) => (
    //   <Link href={`/reservation/details?id=${record.paymentId}`}>{text}</Link>
    // ),
  },
  {
    title: '매출액',
    dataIndex: 'paymentAmount',
  },
  {
    title: '수수료',
    dataIndex: 'fee',
  },
  {
    title: '정산액',
    dataIndex: 'settlementAmount',
  },
];

const Sales = () => {
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴
  console.log(data, '데이터 길이'); // 데이터 길이를 확인

  console.log(data, '데이터터터터터');
  useEffect(() => {
    if (userId !== null) {
      const fetchPayment = async (userId: number) => {
        try {
          const response = await getMySpace(userId);
          // const transformedData = data.map((item) => setData(item));
          const sales = response.data.flatMap((space: any) =>
            space.bookings.flatMap((booking: any) =>
              booking.user?.payments.map((payment: any, index: number) => {
                const paymentAmount = payment.paymentPrice;
                const fee = Math.round(paymentAmount * 0.05); // 5% 수수료
                const settlementAmount = paymentAmount - fee; // 정산액 = 결제금액 - 수수료
                const formattPaymentAmount = paymentAmount.toLocaleString();
                const formattFee = fee.toLocaleString();
                const formattSettlementAmount =
                  settlementAmount.toLocaleString();

                return {
                  key: index + 1,
                  date: booking.startDate,
                  paymentAmount: formattPaymentAmount,
                  spaceName: space.spaceName || '공간명 없음',
                  fee: formattFee,
                  settlementAmount: formattSettlementAmount,
                };
              })
            )
          );
          setData(sales);
        } catch (error) {
          console.error('예약 데이터를 불러오는 데 실패했습니다:', error);
        }
      };
      fetchPayment(userId);
    }
  }, [userId]);

  return (
    <SalesStyled>
      <DateRangePicker />
      <Table<DataType>
        columns={columns}
        dataSource={data}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record),
        // })}
      />
    </SalesStyled>
  );
};
export default Sales;
