import { useEffect, useState } from 'react';

import { CreditCardOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { MainStyled } from './style';
import { getMySpaceBooking } from '@/pages/api/bookingApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';

const MainPage = () => {
  const userId = useSelector((state: RootState) => state.user.userInfo?.id);
  console.log('🚀 ~ MainPage ~ userId:', userId);
  const [todayBooking, setTodayBooking] = useState();
  const [todayPayment, setTodayPayment] = useState();
  const router = useRouter();

  const fetchData = async () => {
    if (userId) {
      const result = await getMySpaceBooking(userId);
    }
    // const user = await getAllUser();
    // const space = await getAllSpace();
    // const booking = await getAllBooking();
    // const payments = await getAllPayment();

    // const todaybooking = booking?.data?.filter((x: any, i: number) => {
    //   return x?.startDate === dayjs().format('YYYY-MM-DD');
    // });
    // const todaypayment = payments?.data?.filter((x: any, i: number) => {
    //   return dayjs(x?.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    // });

    // setTodayBooking(todaybooking.length);
    // setTodayPayment(todaypayment.length);
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
          <p className="title">결제 건수</p>
          <div className="bottom">
            <CreditCardOutlined className="icon" />
            <span>{todayPayment} 건</span>
          </div>
        </div>
        <div className="content" onClick={() => router.push('/review')}>
          <p className="title">금일 등록 리뷰</p>
          <div className="bottom">
            <UserOutlined className="icon" />
            {/* <span>{review} 건</span> */}
          </div>
        </div>
      </div>
      {/* <Charts /> */}
    </MainStyled>
  );
};
export default MainPage;
