<template>
  <div class=" rechargeBox">
    <div class="top">
      <img src="~img/recharge/top.jpg" alt="" />
      <div class="coins">
        <img src="~img/profile/coin.png" alt="" />
        <span> {{ assets.value }} </span>
      </div>
    </div>
    <div class="center">
      <ul class="ul">
        <li
          v-for="(item, index) in goods"
          :key="index"
          @click="goodsClick(item)"
        >
          <div class="box">
            <img :src="index<goodsImg.length?goodsImg[index]:goodsImg[goodsImg.length-1]" alt="" />
            <div class="price">
              <p class="goldNum">{{ item.gold_num }}</p>
              <span class="unit"> {{ item.unit }} </span>
            </div>
            <div class="reward">
                <div v-show="item.giving > 0"><span>+{{ item.giving }}</span> <span>{{ item.unit }}</span></div>
            </div>
            <div class="pay">$ {{ item.price }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <img src="~img/recharge/bottom.png" alt="" />
    </div>

    <Login :showLogin="showLogin" @closePopup="closePopup" />

    <div class="pay-method">
      <van-popup v-model="showPay" @close="closePayPopup">
        <div class="main">
          <div class="content">
            <img src="~img/common/logo.png" class="logo-img" />
            <img src="~img/common/name-reversal.png" class="name-img" />
            <div class="pay-info">
              <div class="coin-info">
                <h3 :style="{'line-height': payPopup.desc ? '1.2rem' : '3rem'}">{{ payPopup.title }}</h3>
                <h5>{{ payPopup.desc }}</h5>
              </div>
              <div class="price-info">
                <h3><span>$</span>{{ payPopup.price }}</h3>
              </div>
            </div>
            <div class="pay-channel">
              <template v-for="(item,index) in payPopup.imgs">
                    <img :key="index" v-if="item.channel_code==='paypal'" src="~img/recharge/paypal.png" alt="" @click="jumpRecharge(item.gateway)" />
                    <img :key="index" v-else src="~img/recharge/stripe.png" alt="" @click="jumpRecharge(item.gateway)" />
              </template>

            </div>
          </div>
          <div class="head">
            <img
              src="~img/profile/close.png"
              class="head-img"
              @click="closePayPopup"
            />
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { userCenter, userCheck, accountCheck } from "@/http/api";
// import Login from "@/components/User/login.vue";
import { actionRecharge, openRecharge, initiateCheckout } from '@/utils/fbq'

export default {
  components: { 
    Login :()=>import( "@/components/User/login.vue")
   },
  data() {
    return {
      goods: [],
      assets: {},
      goodsImg: [
        require("img/recharge/pay-icon1.png"),
        require("img/recharge/pay-icon2.png"),
        require("img/recharge/pay-icon3.png"),
        require("img/recharge/pay-icon4.png"),
        require("img/recharge/pay-icon5.png"),
        require("img/recharge/pay-icon6.png"),
        require("img/recharge/pay-icon7.png"),
        require("img/recharge/pay-icon8.png")
      ],
      showLogin: false,
      showPay: false,
      payPopup: {
          goodsId: '',
          title: '',
          desc: '',
          price: '',
          paypal: '', // 支付链接
          strpie: '' ,
          imgs:[]
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    // 获取个人中心数据
    getCenterData() {
      userCenter(this.$cookie.get("requireParams")).then((res) => {
        this.goods = res.data.goods;
        this.assets = res.data.assets[0];
      });
    },
    goodsClick(item) { // 点击商品购买
    
      accountCheck(this.$cookie.get("requireParams")).then((res) => {
        if (res.code) {
          // 未登录，弹框登录
            this.showLogin = true
            return
        }
      
        this.showPay = true
        this.payPopup.goodsId = item.goods_id;
        this.payPopup.title = item.gold_num + item.unit;
        this.payPopup.desc = item.giving > 0 ? ('+' + item.giving + item.unit) : '';
        this.payPopup.price = item.price;
        // this.payPopup.paypal = item.pal_channel[0].gateway
        // this.payPopup.strpie = item.pal_channel[1].gateway
        this.payPopup.imgs= item.pal_channel
        });
    },
    closePopup() { // 关闭登录弹窗
      this.showLogin = false;
    },
    closePayPopup() {  // 关闭支付弹窗
      this.showPay = false;
    },
    jumpRecharge(url) { // 跳转支付
      let params = JSON.parse(this.$cookie.get("requireParams"))
      let queryArr = [];
      for (let key in params) {
        queryArr.push(key + '=' + params[key]) 
      }
      // 增加商品id和回跳地址
      queryArr.push('goods_id=' + this.payPopup.goodsId)
      if (this.$route.query.redirect == undefined) { // 如果未设置redirect，回跳当前页面
        queryArr.push('redirect=' + encodeURIComponent(window.location.href))
      } else {
        queryArr.push('redirect=' + this.$route.query.redirect)
      }
     
      url += '&' + queryArr.join('&')
      // 上报事件
      actionRecharge()
      initiateCheckout(this.payPopup.price)
      // 跳转支付页
      window.location.href = url
    }
  },
  created() {},
  mounted() {
    this.getCenterData()
    openRecharge()
  },
};
</script>
<style lang="scss" scoped>
.rechargeBox {
  width: 21.5625rem;
  margin: 0.625rem auto 1.5625rem;
}
.top {
  width: 100%;
  height: 12.3125rem;
  position: relative;
  img {
    width: 100%;
  }
  .coins {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 12;
    top: 0.5rem;
    left: 0;
    width: 100%;
    img {
      width: 1.9rem;
      height: 1.9rem;
      margin-right: 0.3rem;
      margin-top: 0.45rem;
    }
    span {
      color: #fff;
      font-size: 2rem;
    }
  }
}
.center {
  width: 100%;
  margin: 0 auto;
  background-image: url("~img/recharge/center.png");
  background-repeat: repeat-y;
  background-size: 100%;
  .ul {
    width: 15.9375rem;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 7.65625rem;
      height: 11.625rem;
      background: #fff;
      box-shadow: 0 0.25rem 0.625rem #a984ff1a;
      border-radius: 0.5rem;
      margin-left: 0.625rem;
      position: relative;
      z-index: 1;
    }
    li:nth-of-type(odd) {
      margin-left: 0;
    }
    li:nth-of-type(n + 3) {
      margin-top: 0.625rem;
    }
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 4.875rem;
        height: 4.25rem;
        margin-top: 1.0625rem;
      }
      .price {
        height: 1.875rem;
        display: flex;
        align-items: flex-end;
        width: 100%;
        justify-content: center;
        .goldNum {
          font-size: 1.4375rem;
          font-weight: 700;
          color: #2e2e33;
          margin-right: 0.3125rem;
          height: 1.4375rem;
          line-height: 1.4375rem;
          font-weight: 700
        }
        .unit {
          font-size: 1rem;
          color: #afafb3;
          height: 1.4375rem;
          line-height: 1.4375rem;
        }
      }
      .reward {
        height: 1.5625rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        color: #9b8cff;
        span {
          font-weight: 400;
        }
      }
      .pay {
        width: 6.40625rem;
        height: 1.5rem;
        background: #9b8cff;
        border-radius: 1.875rem;
        margin: .65rem auto 0;
        text-align: center;
        line-height: 1.5rem;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 400;
      }
    }
  }
}
.bottom {
  width: 100%;
  height: 2.03125rem;
  padding-bottom: 9rem;
  img {
    width: 100%;
    margin-top: -0.1rem;
  }
}
.van-popup--center {
  background: transparent;
}
.pay-method {
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
        width: 6.34375rem;
        height: 1.9375rem;
        margin-top: 0.5rem;
      }
      .pay-info {
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin-top: 1.2rem;
        margin-bottom: .2rem;
        .coin-info {
          text-align: left;  
          h3 {
            font-size: 1.2rem;
            font-weight: 500;
          }
          h5 {
            font-size: 1rem;
            color: #999;
            font-weight: 500;
          }
        }
        .price-info {
          h3 {
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 3rem;
          }
          span {
            font-size: 1rem;
            margin-right: .1rem;
          }
        }
      }
      .pay-channel {
        padding: 0.4rem 0.8rem;
        width: 100%;
        img {
          padding: 0.5rem 0;
          width: 100%;
        }
      }
    }
  }
}
</style>
