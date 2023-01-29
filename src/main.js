/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-04 22:16:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-14 15:55:26
 */
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Qs from 'qs'
import Vant from 'vant'
import store from './store'
import axios from './http/http.js'
import './utils/pxtorem.js'
import 'vant/lib/index.css'
import './assets/icons/iconfont.css'
import GSignInButton from 'vue-google-signin-button'
import FBSignInButton from 'vue-facebook-signin-button'
import Meta from "vue-meta";
import VueI18n from 'vue-i18n'


// /
var VueCookie = require('vue-cookie')
// Tell Vue to use the plugin
Vue.use(VueCookie)
Vue.use(Vant)
Vue.use(GSignInButton)
Vue.use(FBSignInButton)
Vue.use(Meta);
Vue.use(VueI18n)
Vue.config.productionTip = false
window.Qs = Qs
Vue.prototype.$http = axios

const i18n = new VueI18n({
  locale: VueCookie.get('language') ? VueCookie.get('language') : 'en',
  messages: {
    'zh': require('@/i18n/langs/zh'),
    'en': require('@/i18n/langs/en'),
    'tw': require('@/i18n/langs/tw'),
  }
})

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
// 每次路由跳转的时候 都滚动到页面的顶部
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
});