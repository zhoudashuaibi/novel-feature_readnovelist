<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-05 21:06:43
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-23 21:16:53
-->
<template>
  <div style="height: 100%; overflow-y: auto;" >
    <keep-alive >
    <router-view v-if="$route.meta.keepAlive"></router-view>
    <router-view v-else></router-view>
</keep-alive>
    <van-tabbar class="footer" route active-color="#9b8cfc" inactive-color="#999">
      <van-tabbar-item replace to="/discover" icon="fire-o">{{$t('footer.discover')}}</van-tabbar-item>
      <van-tabbar-item replace to="/library" icon="bar-chart-o">{{$t('footer.library')}}</van-tabbar-item>
      <van-tabbar-item replace to="/profile" icon="user-circle-o">{{$t('footer.profile')}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>

.footer {
  position: fixed;
  overflow: hidden;
  width: 100%;
  // height: 0.98rem;
  bottom: 0;
  padding: 0.1rem 0 0 0; 
  background: #fff;
  box-sizing: border-box;
  display: flex;
  z-index: 33;
  width: 100%;
  height: 3.0625rem;
  background: #fff;
  justify-content: space-around;
  /deep/.van-icon{
    font-size: 1.5rem;
  }
}
.weui-tabbar__item {
  flex: 1;
}
/deep/.van-tabbar-item__text{
  font-size: .75rem;
}
</style>
