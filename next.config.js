// const withTM = require('next-transpile-modules')([
//   '@ant-design/icons-svg',
//   '@ant-design/icons',
//   'rc-tree',
//   'rc-util',
//   'rc-pagination',
//   'rc-picker',
//   'rc-table',
// ]);

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true, // This enables SWC's minification
//   images: {
//     unoptimized: true,
//     domains: [
//       //  도메인 혹은 ip주소를 넣어주세요.
//     ],
//   },
//   compiler: {
//     styledComponents: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// module.exports = {
//   webpack(config, { isServer }) {
//     if (isServer) {
//       config.externals = ['rc-input', ...config.externals];
//     }
//     return config;
//   },
// };


// module.exports = withTM(nextConfig);

const withTM = require('next-transpile-modules')([
  'rc-util',
  'rc-tree', // 이 부분을 추가하여 rc-tree 트랜스파일
  'rc-table', // 문제를 일으키는 rc-table 모듈 추가
  '@babel/runtime', // 문제를 일으킬 수 있는 babel/runtime 추가
  'antd',
  '@ant-design/icons',
  'rc-pagination',
  'rc-picker',
]);

module.exports = withTM({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP || 'false',
  },
  assetPrefix: '.',
});
