import { SalesStyled } from './styled';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { getMySpace } from '@/pages/api/spaceApi';
import { Booking, DataType, Payment, SpaceType } from '@/types';
import SalesTable from '../SalesTable';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ChartDay from '../ChartDay';
import { useRouter } from 'next/router';
dayjs.extend(utc); // UTC 플러그인 확장
dayjs.extend(timezone); // timezone 플러그인 사용

const SalesMonthPage = () => {
  const router = useRouter();
  const page = router.pathname;
  const [allData, setAllData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const currentYear = dayjs().year().toString();
  const currentMonth = dayjs().month() + 1; // 현재 월
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const allData = response.data
            .map((space: SpaceType) => {
              return space.bookings
                ?.map((booking: Booking) => {
                  const bookingYear = dayjs(booking.createdAt).tz('Asia/Seoul').format('YYYY');
                  const bookingMonth = dayjs(booking.createdAt).tz('Asia/Seoul').month() + 1; // 월을 1부터 시작

                  if (bookingYear === selectedYear && bookingMonth === selectedMonth) {
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

  // 월별 필터링
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const filteredByMonth = allData.filter(
        (data) =>
          dayjs(data.date).tz('Asia/Seoul').format('YYYY') === selectedYear &&
          dayjs(data.date).tz('Asia/Seoul').month() + 1 === selectedMonth
      );
      setFilteredData(filteredByMonth);
    }
  }, [selectedYear, selectedMonth, allData]);

  const handleMonthChange = (date: any) => {
    if (date) {
      setSelectedYear(date.format('YYYY'));
      setSelectedMonth(date.month() + 1);
    }
  };

  return (
    <SalesStyled>
      {page !== '/' ? (
        <div style={{ marginBottom: 20 }}>
          <DatePicker
            picker="month"
            value={dayjs(`${selectedYear}-${selectedMonth}`)}
            onChange={handleMonthChange}
            style={{ width: 200 }}
            placeholder="월을 선택하세요"
          />
        </div>
      ) : (
        <></>
      )}

      <ChartDay filteredData={filteredData} selectDate={`${selectedYear}-${selectedMonth}`} />
      <SalesTable filteredData={filteredData} />
    </SalesStyled>
  );
};

export default SalesMonthPage;
