import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { ServerStyleSheet } from 'styled-components';

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY
const Document = () => {
  return (
    <Html lang="en">
      <Head></Head>
      <body>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&libraries=services&autoload=false`}
        ></Script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
Document.getInitialProps = async (ctx: any) => {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await ctx.defaultGetInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};

export default Document;
