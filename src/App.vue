<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-14 19:42:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 12:18:22
-->
<template>
  <div id="app" >
    <keep-alive>
        <!-- 如果当前打开页面的路由中 keepAlive: true （开启了缓存时） -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
        
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
// 禁止浏览器缩放
window.onload = function() {
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  })
}

export default {
  name: 'App',
  beforeCreate() {
    const requireParams = {
      'ver': '1.0.0',
      'time': 1636220035,
      'osType': 1,
      'product': 2,
      'language': this.$cookie.get('language') ? this.$cookie.get('language') : 'en',
      'sign': 'id sint a',
      'from_channel': 3,
      'appId': 2,
      'token': this.$cookie.get('token')
      // 'token': 'fdb768c57d3b048b82c8021280d9d4f6'
    }
    this.$cookie.set('requireParams', JSON.stringify(requireParams), 999)
  }
}
</script>

<style>
#app {
  font-family: "Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif";
  background: #fafbff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
	-webkit-touch-callout:none;/*系统默认菜单被禁用*/
	-webkit-user-select:none;/*webkit浏览器*/
	-khtml-user-select:none;/*早起浏览器*/
	-moz-user-select:none;/*火狐浏览器*/
	-ms-user-select:none;/*IE浏览器*/
	user-select:none;/*用户是否能够选中文本*/
 }
input,textarea {
    -webkit-user-select: auto;
}
</style>
<style lang="scss">
@import "@/css/common.scss";
@import "@/css/reset.scss";
@import "@/css/public.scss";
</style>
