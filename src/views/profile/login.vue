<template>
  <Loading :loading="true" /> 
</template>

<script>
import Loading from '@/components/Loading'
import Fingerprint2 from 'fingerprintjs2'
import { deviceLogin } from '@/http/api.js'

export default {
  components: { Loading },
  mounted() {
    this.getDeviceId()
  },
  methods: {
    userLogin(deviceId) { // 发起http请求
      let lid = parseInt(this.$cookie.get('lid'))
      deviceLogin(Object.assign(JSON.parse(this.$cookie.get('requireParams')), {'device_id': deviceId, 'lid': lid})).then(res => {
        this.$cookie.set('token', res.data.user_token, 9999) // 保存cookie
        let params = Object.assign(JSON.parse(this.$cookie.get('requireParams')), {'token': res.data.user_token});
        this.$cookie.set('requireParams', JSON.stringify(params), 999)
        // 回跳之前路由
        let redirect = this.$route.query.redirect == '/profile/login' ? '/' : this.$route.query.redirect
        this.$router.push({path: redirect})
      })
    },

    getDeviceId() { // 获取设备号
      let userLogin = this.userLogin;
      Fingerprint2.get(function(components) {
        const values = components.map(function(component,index) {
          if (index === 0) { //把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
            return component.value.replace(/\bNetType\/\w+\b/, '')
          }
          return component.value
        })
        
        // 生成最终id murmur   
        let deviceId =  Fingerprint2.x64hash128(values.join(''), 31);
        userLogin(deviceId)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  
</style>
