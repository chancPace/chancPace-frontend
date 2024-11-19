import { SalesStyled } from './styled';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
import { Booking, DataType, Payment, SpaceType } from '@/types';
import ChartMonth from '../ChartMonth';
import SalesTable from '../SalesTable';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc); // UTC 플러그인 확장
dayjs.extend(timezone); // timezone 플러그인 사용

const SalesMonthPage = () => {
  const [allData, setAllData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const currentYear = dayjs().year().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const allData = response.data
            .map((space: SpaceType) => {
              return space.bookings
                ?.map((booking: Booking) => {
                  if (
                    dayjs(booking.createdAt).tz('Asia/Seoul').format('YYYY') === dayjs().tz('Asia/Seoul').format('YYYY')
                  ) {
                    const user = booking.user;
                    const payment = user?.payments.find((p: Payment) => p.id === booking.paymentId);
                    const paymentAmount = payment ? payment.paymentPrice : 0;
                    const couponAmount = payment ? payment.couponPrice : 0;
                    const totalAmount = paymentAmount + couponAmount;
                    const feeAmount = paymentAmount * 0.05;
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
                    const feeAmount = paymentAmount * 0.05;
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

  // 연도 필터링
  useEffect(() => {
    if (selectedYear) {
      const filteredByYear = allData.filter(
        (data) => dayjs(data.date).tz('Asia/Seoul').format('YYYY') === selectedYear
      );
      setFilteredData(filteredByYear);
    }
  }, [selectedYear, allData]);

  const handleYearChange = (date: any) => {
    if (date) {
      setSelectedYear(date.format('YYYY'));
    }
  };

  return (
    <SalesStyled>
      <div style={{ marginBottom: 20 }}>
        <DatePicker
          picker="year"
          value={dayjs(`${selectedYear}`)}
          onChange={handleYearChange}
          style={{ width: 200 }}
          placeholder="연도를 선택하세요"
        />
      </div>
      <ChartMonth filteredData={filteredData} selectDate={selectedYear} />
      <SalesTable filteredData={filteredData} />
    </SalesStyled>
  );
};

export default SalesMonthPage;
