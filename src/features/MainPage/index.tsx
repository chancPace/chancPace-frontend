import { useEffect, useState } from 'react';
import { CreditCardOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { MainStyled } from './style';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getMySpace } from '@/pages/api/spaceApi';
import ChartDay from '@/components/ChartDay';
import { Booking, DataType, Payment, SpaceType } from '@/types';
dayjs.extend(utc); // UTC 플러그인 확장
dayjs.extend(timezone); // timezone 플러그인 사용

const MainPage = () => {
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [todayBooking, setTodayBooking] = useState(0);
  const [todayPayment, setTodayPayment] = useState(0);
  const [todayReview, setTodayReview] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const mySpace = await getMySpace(userId);
          const notcancel = mySpace?.data
            ?.filter((space: SpaceType) => space?.bookings?.length !== 0)
            ?.map((space: SpaceType) => {
              const validBookings = space?.bookings?.filter(
                (booking: Booking) => booking.bookingStatus !== 'CANCELLED'
              );
              return { ...space, bookings: validBookings };
            });

          const transformedData = notcancel
            .map((space: SpaceType) => {
              return space?.bookings?.map((booking: Booking) => {
                const user = booking?.user;
                const payment = user?.payments?.find((p: Payment) => p.id === booking.paymentId);
                const paymentAmount = payment ? payment?.paymentPrice : 0;
                const couponAmount = payment ? payment?.couponPrice : 0;
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
              });
            })
            .flat();
          setFilteredData(transformedData);

          const todayUse = notcancel.map((x: any) =>
            x.bookings.filter(
              (x: any) =>
                dayjs(x.startDate).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                dayjs().tz('Asia/Seoul').format('YYYY-MM-DD'),
              console.log('🚀 ~ todayUse ~ x:', x),
              console.log('🚀 ~ todayUse 시작', dayjs(x.startDate).tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log('🚀 ~todayUse 끝', dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log(
                '🚀 ~ todayUse 비교',
                dayjs(x.startDate).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                  dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')
              )
            )
          );
          const todayPay = notcancel.map((x: any) =>
            x.bookings.filter(
              (x: any) =>
                dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                dayjs().tz('Asia/Seoul').format('YYYY-MM-DD'),
              console.log('🚀 ~ todayPay ~ x:', x),
              console.log('🚀 ~ todayPay 시작', dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log('🚀 ~ todayPay 끝', dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log(
                '🚀 ~ fetchData ~    dayjs 비교',
                dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                  dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')
              )
            )
          );
          const todayReview = notcancel.map((x: any) =>
            x.reviews.filter(
              (x: any) =>
                dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                dayjs().tz('Asia/Seoul').format('YYYY-MM-DD'),
              console.log('🚀 ~ todayReview ~ x:', x),
              console.log('🚀 ~ todayReview 시작', dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log('🚀 ~todayReview 끝', dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')),
              console.log(
                '🚀 ~ fetchData ~    dayjs todayReview 비교',
                dayjs(x.createdAt).tz('Asia/Seoul').format('YYYY-MM-DD') ===
                  dayjs().tz('Asia/Seoul').format('YYYY-MM-DD')
              )
            )
          );
          console.log('🚀 ~ fetchData ~ todayUse:', todayUse);
          console.log('🚀 ~ fetchData ~ todayPay:', todayPay);
          console.log('🚀 ~ fetchData ~ todayReview:', todayReview);
          const todayUseCount = todayUse.filter((x: any) => x.length !== 0);
          const todayPayCount = todayPay.filter((x: any) => x.length !== 0);
          const todayReviewCount = todayReview.filter((x: any) => x.length !== 0);

          setTodayBooking(todayUseCount.length);
          setTodayPayment(todayPayCount.length);
          setTodayReview(todayReviewCount.length);
        } catch (error) {
          console.error('공간을 불러오지 못했습니다.', error);
        }
      }
    };
    fetchData();
  }, [userId]);

  return (
    <MainStyled>
      <div className="content_wrap">
        <div className="content" onClick={() => router.push('/reservation')}>
          <p className="title">금일 공간 이용 예정</p>
          <div className="bottom">
            <HomeOutlined className="icon" />
            <span>{todayBooking} 건</span>
          </div>
        </div>
        <div className="content" onClick={() => router.push('/sales/day')}>
          <p className="title">금일 결제 건수</p>
          <div className="bottom">
            <CreditCardOutlined className="icon" />
            <span>{todayPayment} 건</span>
          </div>
        </div>
        <div className="content" onClick={() => router.push('/review')}>
          <p className="title">금일 등록 리뷰</p>
          <div className="bottom">
            <UserOutlined className="icon" />
            <span>{todayReview} 건</span>
          </div>
        </div>
      </div>
      <ChartDay filteredData={filteredData} />
    </MainStyled>
  );
};
export default MainPage;
