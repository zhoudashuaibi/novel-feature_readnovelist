'use strict'

import axios from 'axios'
// import qs from 'qs'
axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? '/api' : 'http://open-test.beiwo-xiaoshuo.com/'
axios.defaults.withCredentials = true
axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = sessionStorage.getItem('token')
      ? sessionStorage.getItem('token')
      : ''
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.resolve(error.response)
  }
)

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  } else {
    const err = {
      message: '',
      status: (response && response.status) || ''
    }
    switch (err.status) {
      case 400:
        err.message = '请求参数错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '拒绝访问，请登录'
        break

      case 404:
        err.message = `请求地址出错:`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
        err.message = '网络错误'
        break
    }
    // 异常状态下，把错误信息返回去
    err.message = `${(response && response.config.url) || '' + err.message}`
    return err
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (!res.code) {
    // Message({
    //   message: res.message + " " + res.status,
    //   type: "error",
    //   duration: 3 * 1000
    // });
  } else {
    return res
  }
}
export default {
  post(url, data, type) {
    let ContentType = 'application/x-www-form-urlencoded;charset=UTF-8'
    let postData = ''
    const token = sessionStorage.getItem('token')
      ? sessionStorage.getItem('token')
      : ''

    const body = {
      // 'a-token': token,
      gid: -84654402.36625561,
      lid: 33233310.8880098,
      ver: '1.0.0',
      time: 1636208461,
      osType: 1,
      product: 1,
      language: 'zh',
      sign: 'sint sunt aliquip',
      token: token
    }
    if (type === 'JSON') {
      ContentType = 'application/json'
      postData = data
    } else {
      postData = data
    }
    return axios({
      method: 'post',
      url,
      data: Object.assign(postData, body),
      timeout: 50000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': ContentType,
        appScope: 6,
        Authorization: token
      }
    })
      .then(response => {
        return checkStatus(response)
      })
      .then(res => {
        return checkCode(res)
      })
  },

  get(url, params, time) {
    const token = sessionStorage.getItem('token')
      ? sessionStorage.getItem('token')
      : ''

    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      timeout: Number(time) ? time : '50000',
      headers: {
        Authorization: token,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => {
        return checkStatus(response)
      })
      .then(res => {
        return checkCode(res)
      })
  }
}
