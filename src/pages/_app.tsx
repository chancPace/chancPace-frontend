import NotPc from '@/features/NotPc';
import Template from '@/layouts/Template';
import { GlobalStyled } from '@/styles/global';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [notPc, setNotPc] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setNotPc(true);
      } else {
        setNotPc(false);
      }
    };

    // 초기 width 확인
    handleResize();

    // resize 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <Head>
        <title>🏠ChancePaceHost</title>
      </Head>
      <GlobalStyled />
      {notPc ? (
        <NotPc />
      ) : (
        <Template>
          <Component {...pageProps} />
        </Template>
      )}
    </>
  );
}
