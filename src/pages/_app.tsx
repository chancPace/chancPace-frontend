import Template from '@/layouts/Template';
import { GlobalStyled } from '@/styles/global';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
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
