/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-05 23:13:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-07 01:41:54
 */
// 拦截文件

import axios from 'axios'

// 创建一个实例
const instance = axios.create({
  baseURL: '/api',
  // 请求延时为30000毫秒
  timeout: 30000
})

// 拦截器 请求拦截
instance.interceptors.request.use(config => {
  // 配置项  携带的数据(部分接口需要拿到token)
  const token = localStorage.getItem('token')
  // const token = true
  // 如果有token 就把token的值给配置文件的headers中
  if (token) {
    // config.headers.token = token;

    // 如果token有其他的名字 如：a-token
    // config.headers = {
    //   'a-token': token,
    //   'gid': -84654402.36625561,
    //   'lid': 33233310.8880098,
    //   'ver': '1.0.0',
    //   'time': 1636208461,
    //   'osType': 1,
    //   'product': 1,
    //   'language': 'zh',
    //   'sign': 'sint sunt aliquip',
    //   'token': token
    // }
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 拦截器 响应拦截
instance.interceptors.response.use(res => {
  if (res.data === {}) {
    return res
  } else {
    return res.data
  }
}, err => {
  return Promise.reject(err)
})

// 整体导出
export default instance
