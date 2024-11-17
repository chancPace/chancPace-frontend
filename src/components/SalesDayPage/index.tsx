import { SalesStyled } from './styled';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
import { Booking, DataType, Payment, SpaceType } from '@/types';
import ChartDay from '../ChartDay';
import SalesTable from '../SalesTable';

const SalesDayPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const transformedData = response.data
            .map((space: SpaceType) => {
              return space.bookings
                ?.map((booking: Booking) => {
                  if (booking.bookingStatus !== 'CANCELLED') {
                    const user = booking.user;
                    const payment = user?.payments.find((p: Payment) => p.id === booking.paymentId);
                    const paymentAmount = payment ? payment.paymentPrice : 0;
                    const couponAmount = payment ? payment.couponPrice : 0;
                    const totalAmount = paymentAmount + couponAmount;
                    const feeAmount = totalAmount * 0.05;
                    const settlementAmount = totalAmount - feeAmount;
                    return {
                      key: booking.id,
                      paymentId: booking.paymentId,
                      date: booking.createdAt,
                      spaceName: space.spaceName,
                      totalAmount,
                      feeAmount,
                      settlementAmount,
                    };
                  } else {
                    return null;
                  }
                })
                .filter((booking: any) => booking !== null);
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

  return (
    <SalesStyled>
      <ChartDay filteredData={filteredData} />
      <SalesTable filteredData={filteredData} />
    </SalesStyled>
  );
};

export default SalesDayPage;
