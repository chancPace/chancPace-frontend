import { SalesStyled } from './styled';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
import { Booking, DataType, Payment, SpaceType } from '@/types';
import ChartMonth from '../ChartMonth';
import SalesTable from '../SalesTable';

const SalesMonthPage = () => {
  const [allData, setAllData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const allData = response.data
            .map((space: SpaceType) => {
              return space.bookings
                ?.map((booking: Booking) => {
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
                    bookingStatus: booking.bookingStatus,
                  };
                })
                .filter((booking: any) => booking !== undefined);
            })
            .flat();

          setAllData(allData);

          const nonCancelData = response.data
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
                      bookingStatus: booking.bookingStatus,
                    };
                  }
                })
                .filter((booking: any) => booking !== undefined);
            })
            .flat();
          setFilteredData(nonCancelData);
        } catch (error) {
          console.error('예약 데이터 불러오기 실패:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  return (
    <SalesStyled>
      <ChartMonth filteredData={filteredData} />
      <SalesTable filteredData={allData} />
    </SalesStyled>
  );
};

export default SalesMonthPage;
