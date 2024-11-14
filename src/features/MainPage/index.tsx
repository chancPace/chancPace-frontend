import { useEffect, useState } from 'react';
import { CreditCardOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { MainStyled } from './style';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import dayjs from 'dayjs';
import { getMySpace } from '@/pages/api/spaceApi';
import ChartDay from '@/components/ChartDay';
import { Booking, DataType, Payment, SpaceType } from '@/types';

const MainPage = () => {
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [todayBooking, setTodayBooking] = useState();
  const [todayPayment, setTodayPayment] = useState();
  const [todayReview, setTodayReview] = useState();
  const router = useRouter();

  const fetchData = async () => {
    if (userId) {
      const mySpace = await getMySpace(userId);
      const transformedData = mySpace.data
        .map((space: SpaceType) => {
          return space.bookings?.map((booking: Booking) => {
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
          });
        })
        .flat();
      setFilteredData(transformedData);

      const bookings = mySpace.data.filter((x: any) => x.bookings.length !== 0);
      const todayUse = bookings.map((x: any) =>
        x.bookings.filter((x: any) => x.startDate === dayjs().format('YYYY-MM-DD'))
      );
      const todayPay = bookings.map((x: any) =>
        x.bookings.filter((x: any) => dayjs(x.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
      );
      const todayReview = bookings.map((x: any) =>
        x.reviews.filter((x: any) => dayjs(x.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
      );
      const todayUseCount = todayUse.filter((x: any) => x.length !== 0);
      const todayPayCount = todayPay.filter((x: any) => x.length !== 0);
      const todayReviewCount = todayReview.filter((x: any) => x.length !== 0);
      setTodayBooking(todayUseCount.length);
      setTodayPayment(todayPayCount.length);
      setTodayReview(todayReviewCount.length);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="content" onClick={() => router.push('/sales')}>
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
