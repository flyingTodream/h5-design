const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  publicPath: "/", // 公共路径
  lintOnSave: "error",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        onProxyRes: null,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: config => {
    config.resolve.alias = Object.assign(config.resolve.alias, {
      vue$: "vue/dist/vue",
      src: path.resolve(__dirname, "./src"),
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components")
    });
    //gzip压缩
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.css/,
            threshold: 10240,
            deleteOriginalAssets: false
          })
        ]
      };
    }
  },
  chainWebpack: config => {
    config
      // 开发环境
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );
  }
};
