/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-05 22:57:57
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-14 23:25:38
 */
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    open: true,
    hot: true,
    // host: '0.0.0.0',
    port: 8080,
    proxy: {
      // 配置代理地址
      '/api': {
        target: 'http://open.readnovelist.net/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
      // '/api': {
      //   target: 'http://api-inner-test34.beiwo-xiaoshuo.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      //   // secure: false,
      // }
    }
  },
  configureWebpack: (config) => {
    config.resolve = {
      extensions: ['.js', '.vue', '.json', '.css', '.scss'],
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        public: resolve('public'),
        img: resolve('src/assets/img')
      }
    }
  },
  chainWebpack: (config) => {
    config.entry = ['@babel-polyfill', resolve('src/main.js')]
  },
  transpileDependencies: [/\bvue-echarts\b/, /\bresize-detector\b/]
}
