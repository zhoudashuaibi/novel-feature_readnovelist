<template>
  <div>
    <Recharge></Recharge>
    <Login :showLogin="showLogin" @closePopup="closePopup"/>
  </div>
</template>

<script>
import Recharge from '@/components/Recharge'
import Login from '@/components/User/login'
import {userCenter} from '@/http/api'

export default {
components: {Recharge, Login},
  data() {
    return {
      isLogin: false, // 是否登录
      showLogin: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    login() { // 登录
      this.showLogin = true
    },
    closePopup() { // 关闭弹窗
      this.showLogin = false;
    },
    logout() { // 登出
      this.$cookie.set('token', '')
      window.location.reload()
    }
  },
  created() {

  },
  mounted() {
    // 登录状态检查
    userCenter(JSON.parse(this.$cookie.get('requireParams'))).then(res => {
      if (Object.keys(res.data.user).length > 0) {
        this.isLogin = true
      }
    })
  },
}
</script>

<style scoped lang="scss">
  /deep/ .bottom {
    padding-bottom: 5rem !important;
  }
</style>
