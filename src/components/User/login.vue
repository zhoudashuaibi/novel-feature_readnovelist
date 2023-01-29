<template>
  <div class="login">
    <van-popup v-model="showLogin" @close="closePopup" :lazy-render="false">
      <div class="main">
        <div class="content">
          <img src="~img/common/logo.png" class="logo-img">
          <img src="~img/common/name-reversal.png" class="name-img">
          <fb-signin-button href="javascript: void(0);" class="fb-login login-item" :params="fbSignInParams" @success="onSignInSuccessFb" @error="onSignInErrorFb">
             <span class="span-img">
              <img src="~img/profile/facebook.png" alt="">
            </span>
            Sign in with Facebook
          </fb-signin-button>
          <div id="buttonDiv">
            </div> 

          <div class="login-bot">
            By creating an account, I agree to the
            <a rel="nofollow" href="/user-agreement" target="_blank">User Agreement</a>
            And
            <a rel="nofollow" href="/privacy-policy" target="_blank">Privacy Policy</a>
          </div>
        </div>
        <div class="head">
          <img
            src="~img/profile/close.png"
            class="head-img"
            @click="closePopup"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import '@/assets/sdk/api_client.js'
// import '@/assets/sdk/fb_client.js'
import {googleLogin, facebookLogin} from '@/http/api'
import { completeRegistration, login } from '@/utils/fbq'
import  jwt  from  'jsonwebtoken'

export default {
  props: {
    showLogin: Boolean
  },
  data() {
    return {
      fbSignInParams: {
        scope: 'email,user_likes',
        return_scopes: true
      }
    }
  },
  created(){
    
  },
  mounted() {
    google.accounts.id.initialize({
      client_id: "579029129571-p9ia80rfkg89ddd8vv76ane7m51luem9.apps.googleusercontent.com",
      callback: this.handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
  },
  methods: {
    onSignInSuccessFb(response) {
      FB.api('/me?fields=id,name,gender,first_name,last_name,email,birthday,hometown', dude => {
        const openid = dude.id
        const name = dude.name
        const avatar = dude.name
        facebookLogin(Object.assign(JSON.parse(this.$cookie.get('requireParams')), {open_id: openid, nickname: name, avatar: avatar})).then(res => {
          login()
          if (res.data.is_new == 1) { // 新用户
            completeRegistration()
          }
          this.$cookie.set('token', res.data.user_token, 9999) 
          window.location.reload()
        })
      })
    },
    onSignInErrorFb(error) {
      console.log('OH NOES', error)
    },
    closePopup() { // 关闭弹窗
      this.$emit('closePopup')
    },
    handleCredentialResponse(response) {
      const params = jwt.decode(response.credential)
      googleLogin(Object.assign(JSON.parse(this.$cookie.get('requireParams')), {open_id: params.sub, nickname: params.name, avatar: params.picture})).then(res => {
         login()
          if (res.data.is_new == 1) { // 新用户
            completeRegistration()
          }
          this.$cookie.set('token', res.data.user_token, 9999) 
          window.location.reload()
      })
    }
  },

  watch: {
    showLogin: {
      handler(newValue, oldValue) {
        google.accounts.id.prompt(); // also display the One Tap dialog
        this.showLogin = newValue
      }
    }
  }
}
</script>

<style scoped lang="scss">
.van-popup--center {
  background: transparent;
}
.login {
  .main {
    display: flex;
    flex-direction: column;
    width: 19.6875rem;

    .head {
      width: 100%;
      height: 4rem;
      display: table-cell;
      vertical-align: middle;
	    text-align: center;
      padding-top: 0.2rem;
      .head-img {
        margin-top: 1rem;  
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    .content {
      width: 100%;
      height: 25.1875rem;
      background: #fff;
      border-radius: 1.125rem;
      background-image: url(~img/recharge/pay-back.png);
      background-size: 100%;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 0.625rem;
      .logo-img {
        width: 5.125rem;
        height: 5.125rem;
        border-radius: 0.8rem;
        margin-top: 0.5rem;
      }
      .name-img {
        width: auto;
        height: 1.9375rem;
        margin-top: 0.5rem;
      }

      .login-item {
        width: 17.1875rem;
        height: 2.75rem;
        background: #fff;
        box-shadow: 0 0.09375rem 0.75rem #e3deff;
        border-radius: 1.875rem;
        line-height: 2.75rem;
        text-align: center;
        position: relative;
        color: #333;
        font-size: 1rem;
        .span-img {
          position: absolute;
          height: 2.75rem;
          line-height: 3.125rem;
          top: .15rem;
          left: 0.8125rem;
          img {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      }
      .fb-login {
        margin: 2rem 0 1rem
      }
      .login-bot {
        width: 17.8125rem;
        font-size: .75rem;
        margin: 1.4375rem auto;
        line-height: 1.0625rem;
        text-align: center;
        a {
          text-decoration: underline;
          color: #716e84;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
