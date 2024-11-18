const withTM = require('next-transpile-modules')([
  'rc-util',
  'rc-tree',
  'rc-table',
  '@babel/runtime',
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
  assetPrefix: '',
});
