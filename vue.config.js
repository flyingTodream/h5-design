const {
  recordProxyJson
} = require('./src/mock/record');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin')
const saveJSON = process.env.NODE_ENV === 'development' && process.env.APP_SAVE_JSON === 'true';
const context = process.env.VUE_APP_API;
module.exports = {
  publicPath: '/', // 公共路径
  lintOnSave: 'error',
  productionSourceMap: false,
  devServer: {
    proxy: {
      [context]: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        onProxyRes: saveJSON ? recordProxyJson : null
      }
    }
  },
  configureWebpack: config => {
    config.resolve.alias = Object.assign(config.resolve.alias, {
      'vue$': 'vue/dist/vue',
      'src': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
    });
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.css/,
          threshold: 1024,
          deleteOriginalAssets: false
        })]
      }
    }
  },
  chainWebpack: config => {
    config
      // 开发环境
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      );

    // const entry = config.entry('app');
    // // 判断环境加入模拟数据
    // if (process.env.VUE_APP_BUILD_MODE !== 'nomock') {
    //     entry
    //         .add('@/mock')
    //         .end();
    // }
  }
};
