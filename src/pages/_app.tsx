import Template from '@/layouts/Template';
import { GlobalStyled } from '@/styles/global';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import AppWrapper from '@/components/AppWrapper';
import { Provider } from 'react-redux';
import { persistor, store } from '@/utill/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import LoginPage from '@/features/LoginPage';

export default function App({ Component, pageProps }: AppProps) {
  const [token, setToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getToken = Cookies.get('token');
    if (getToken) {
      setToken(true);
    } else {
      setToken(false);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>🏠ChancePaceHost</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyled />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!token ? <LoginPage /> : <AppWrapper Component={Component} pageProps={pageProps} />}
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </>
  );
}
