import http from '@/http/http.js'
import router from '@/router'
export default {
  state: {
    userInfo: null
  },
  mutations: {
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    }
  },
  actions: {
    getUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        http.post('/sys/user/tokenToUser', {}).then(response => {
          if (!response || !response.data || response.data === 'null') {
            router.push('/login')
            reject('error')
            return false
          }
          const data = response.data
          http.get('/sys/user/queryPermission').then(res => {
            if (!res || !res.data || res.data === 'null') {
              reject('error')
              return false
            }
            data.menuList = res.data
            // response.data = JSON.stringify(data);
            commit('SET_USER_INFO', data)
          }).catch(error => {
            reject(error)
          })
          resolve(response)
        })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
