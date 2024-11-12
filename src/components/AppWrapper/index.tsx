import Template from '@/layouts/Template';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { logout, setUser } from '@/utill/redux/slices/userSlice';
import { getUser } from '@/pages/api/userApi';
import { RootState } from '@/utill/redux/store';
import Header from '@/features/Header';
import NotHost from '@/features/NotHost';

const AppWrapper = ({ Component, pageProps }: { Component: any; pageProps: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userInfo } = useSelector((state: RootState) => state.user);
  const token = Cookies.get('token');

  const fetchUserData = async () => {
    if (token) {
      try {
        const userData = await getUser(token);
        if (userData.result) {
          dispatch(
            setUser({
              email: userData.data.email,
              name: userData.data.name,
              role: userData.data.role,
              token,
            })
          );
        }
      } catch (error: any) {
        console.error('에러발생');
        router.push('/login');
      }
    } else {
      dispatch(logout());
      console.error('토큰이 없습니다');
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [dispatch, router]);

  if (isLoggedIn) {
    if (userInfo?.role === 'HOST' || userInfo?.role === 'ADMIN') {
      return (
        <>
          <Header />
          <Template>
            <Component {...pageProps} />
          </Template>
        </>
      );
    } else {
      return (
        <>
          <NotHost />
        </>
      );
    }
  } else {
    return (
      <>
        <Header />
        <Component {...pageProps} />
      </>
    );
  }
};
export default AppWrapper;
