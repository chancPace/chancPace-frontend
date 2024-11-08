import { SalesStyled } from './styled';
import { DatePicker, Table, TableColumnsType } from 'antd';
const { RangePicker } = DatePicker;
import DateRangePicker from '../DateRangePicker';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
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
    title: '예약일',
    dataIndex: 'date',
  },
  {
    title: '공간명',
    dataIndex: 'spaceName',
  },
  {
    title: '매출액',
    dataIndex: 'totalAmount',
  },
  {
    title: '수수료',
    dataIndex: 'feeAmount',
  },
  {
    title: '정산액',
    dataIndex: 'settlementAmount',
  },
];

const Sales = () => {
  const router = useRouter();
  const [data, setData] = useState<DataType[]>([]); // 예약 데이터를 저장할 상태
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴
  // console.log(data, '데이터 길이'); // 데이터 길이를 확인

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);

          const transformedData = response.data
            .map((space: any) => {
              return space.bookings?.map((booking: any) => {
                const user = booking.user;
                const payment = user?.payments.find(
                  (p: any) => p.id === booking.paymentId
                );
                const paymentAmount = payment ? payment.paymentPrice : 0;
                const couponAmount = payment ? payment.couponPrice : 0;
                const totalAmount = paymentAmount + couponAmount;
                const feeAmount = totalAmount * 0.05; // 수수료 (매출액의 5%)
                const settlementAmount = totalAmount - feeAmount; // 정산 금액

                return {
                  paymentId: booking.paymentId,
                  date: booking.startDate,
                  spaceName: space.spaceName,
                  totalAmount: totalAmount || '정보 없음',
                  feeAmount: feeAmount || '정보 없음',
                  settlementAmount: settlementAmount || '정보 없음',
                };
              });
            })
            .flat();

          setData(transformedData);
        } catch (error) {
          console.error('예약 데이터 불러오기 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleRowClick = (record: DataType) => {
    router.push(`/sales/details?id=${record.paymentId}`);
  };

  return (
    <SalesStyled>
      <DateRangePicker />
      <Table<DataType>
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </SalesStyled>
  );
};
export default Sales;
