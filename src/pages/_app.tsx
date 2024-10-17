import Template from '@/layouts/Template';
import { GlobalStyled } from '@/styles/global';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>🏠ChancePaceHost</title>
      </Head>
      <GlobalStyled />
        <Template>
          <Component {...pageProps} />
        </Template>
    </>
  );
}
