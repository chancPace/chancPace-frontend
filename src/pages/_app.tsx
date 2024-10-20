import Template from '@/layouts/Template';
import { GlobalStyled } from '@/styles/global';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    const [hasToken, setHasToken] = useState<boolean>(false);
    const router = useRouter();
    // 쿠키에서 토큰 가져오기
    // const token = Cookies.get('token');
    // console.log('token', token);

    // useEffect(() => {
    //     if (token) {
    //         setHasToken(true); // 토큰이 있으면 상태를 true로 설정
    //     } else {
    //         setHasToken(false); // 토큰이 없으면 false로 설정
    //         router.push('/login'); // 로그인 페이지로 리다이렉트
    //     }
    //     // 토큰을 백으로 던져서 유저정보를 받아서 리덕스에 저장시키는 로직 구현하기!!!!!!!!
    // }, [token]);

    // // 로딩 중 상태일 때
    // if (!hasToken && router.pathname !== '/login') {
    //     return null; // 로그인 페이지로 이동 중일 때 템플릿을 숨김
    // }

    return (
        <>
            <Head>
                <title>🏠ChancePaceHost</title>
            </Head>
            <ThemeProvider theme={theme}>
                <GlobalStyled />
                <Template>
                    <Component {...pageProps} />
                </Template>
            </ThemeProvider>
        </>
    );
}
