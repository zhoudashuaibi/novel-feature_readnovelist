<template>
<div class=" ">
    <div class="top">
      <span @click="$router.push('answerList')" class="feedback" v-if="isLogin"> {{ $t('user.feedback') }} </span>
      <!-- <span class="logOut" v-show="isLogin" @click="logout">Log out</span> -->
      <span class="language" @click="selectLanguageDialog = true">{{$t('user.switchLanguage')}}</span>
      <span class="logOut" @click="switchAccount">{{$t('user.switchAccount')}}</span>
      <div class="infoBox">
        <div class="coverBox">
          <div class="cover">
            <img src="~/img/profile/default-avatar.png" v-if="!isLogin || !userAvatar">
            <img :src="userAvatar" v-if="isLogin">
          </div>
        </div>
        <span v-if="!isLogin" class="logIn"  @click="login">{{$t('user.login')}}</span>
        <h3 v-if="isLogin" class="name">{{userNickname}}</h3>
      </div>

      <div class="backImg">
        <img src="~img/profile/personalCenter.png" alt="">
      </div>
    </div>

    <div class="bottom">
      <Recharge></Recharge>
    </div>

    <Login :showLogin="showLogin" @closePopup="closePopup"/>

    <van-dialog v-model="selectLanguageDialog" :title="$t('user.selectLanguage')" :confirm-button-text="$t('msg.confirm')" :cancel-button-text="$t('msg.cancel')" show-cancel-button  @confirm="selectLanguage()">
      <div class="language-info">
        <van-radio-group v-model="currentLanguage">
           <van-cell-group>
            <van-cell v-for="(value, name) in languageMap" :title="value" clickable @click="radio = name">
              <template #right-icon>
                <van-radio :name="name" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </van-dialog>
</div>
</template>

<script>
import Recharge from '@/components/Recharge'
import {userCenter} from '@/http/api'

const languageMap = {
  'zh': '简体中文',
  'tw': '繁体中文',
  'en': 'English'
}

export default {
components: {Recharge, Login :()=>import( "@/components/User/login.vue")},
  data() {
    return {
      isLogin: false, // 是否登录
      userAvatar: '', // 用户头像
      userNickname: '', // 用户昵称
      showLogin: false,
      selectLanguageDialog: false,
      currentLanguage: '',
      languageMap: languageMap
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
    },
    switchAccount() { // 切换账号
      this.showLogin = true
    },
    selectLanguage() { // 选择语种
      this.$cookie.set('language', this.currentLanguage, 9999) 
      window.location.reload()
    }
  },
  created() {
    this.currentLanguage = this.$cookie.get('language')
  },
  mounted() {
    // 登录状态检查
    userCenter(JSON.parse(this.$cookie.get('requireParams'))).then(res => {
      if (Object.keys(res.data.user).length > 0) {
        this.isLogin = true
        this.userAvatar = res.data.user.avatar
        this.userNickname = res.data.user.nickname
      }
    })
  },
}
</script>

<style lang='scss' scoped>
.scroll{
  width: 100vw;
  height: calc(100vh - 0.98rem);
  overflow-y: auto;
}
.top{
    width: 100%;
    position: relative;
    padding-top: 3.125rem;
}
.language{
    padding: 0 0.625rem;
    height: 1.5rem;
    background: #505061;
    border-radius: 0.78125rem;
    line-height: 1.5rem;
    text-align: center;
    color: #fff;
    font-size: .75rem;
    position: absolute;
    top: 0.625rem;
    left: 6rem;
    z-index: 222;
}
.logOut{
    padding: 0 0.625rem;
    height: 1.5rem;
    background: #505061;
    border-radius: 0.78125rem;
    line-height: 1.5rem;
    text-align: center;
    color: #fff;
    font-size: .75rem;
    position: absolute;
    top: 0.625rem;
    right: 0.9375rem;
    z-index: 222;
}
.logIn{
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    padding: 0 0.625rem;
    background: linear-gradient(96deg,#9b8cff,#5e45ff);
    border-radius: 1.0625rem;
    line-height: 2rem;
    margin: 0.625rem auto 0;
    display: block;
    height: 2rem;
    text-align: center;
    font-size: 1.125rem;
    color: #fff;
    font-weight: 700;
}
.coverBox{
    width: 4.6875rem;
    height: 4.6875rem;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    img{
      width: 100%;
      height: 100%;
    }
}
.infoBox{
  position: relative;
  z-index: 3;
}
.backImg{
    width: 100%;
    height: 16.15625rem;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    img{
      width: 100%;
      height: 100%;
    }
}
.name{
    height: 2rem;
    text-align: center;
    font-size: 1.125rem;
    color: #fff;
    font-weight: 700;
    width: 100%;
    line-height: 1.5625rem;
    margin-top: 0.625rem;
}
.bottom{
  position: relative;
  z-index: 10;
  background: #fff;
  padding-top: 1.5rem;
  border-radius: 3rem 3rem 0 0;
  top: 1.5rem;
}
.feedback{
   padding: 0 0.625rem;
    height: 1.5rem;
    background: #505061;
    border-radius: 0.78125rem;
    line-height: 1.5rem;
    text-align: center;
    color: #fff;
    font-size: .75rem;
    position: absolute;
    top: 0.625rem;
    left: 0.9375rem;
    z-index: 222;
}
.language-info {
  text-align: left;
}
</style>
