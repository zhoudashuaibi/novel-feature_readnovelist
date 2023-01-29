import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token'),
    title: ''
  },
  mutations: {
    clear(state, val) {
      state.token = val
      sessionStorage.setItem('token', val)
    },
    recordScroll(state, n) {
      state.scrollTop = n
    }
  },
  modules: {
    user
  }
})

export default store
