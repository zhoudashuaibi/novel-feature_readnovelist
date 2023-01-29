<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-06 17:39:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 13:53:01
-->
<!--  -->
<template>
  <div class="mh min"
       :class="colorWrap">
    <van-list v-model="loading"
              :finished="finished"
              :finished-text="$t('read.noMore')"
              loading-text="Loading"
              :immediate-check="false"
              :error.sync="error"
              error-text="Request failed, click reload"
              @load="onLoad"
              :offset="100"
              v-if="data.length">
      <div v-for="(item, index) in data"
           :key="index"
           class="itemBox"
           :class="rootFontClass"
           @click="control = !control">
        <h1 class="chapterTitle">{{ item.chapter_title }}</h1>
        <p class="chapterContent">{{ item.content }}</p>
        <div v-if="item.is_preview"
             class="lockBox">
          <div class="lockWrap">
            <div class="toLock">
              <img src="~img/detail/freeTop.png"
                   alt="" />
              <span> {{ item.tip }} </span>
              <div class="btn"
                   @click.stop="buyThisChapter(item)">
                <i>{{
                  item.chapter_price > balance
                    ? "Buy coins to continue reading"
                    : "Buy chapter"
                }}</i>
              </div>
              <div class="balance">
                <span class="balanceNumber">{{$t('read.blance')}}: {{ balance }}</span>
                &nbsp;
                <img class="balanceImg"
                     src="~img/reader/coin.png"
                     alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <!-- 顶部信息 -->
    <div v-show="control"
         class="topBack">
      <i class="icon-fanhui iconfont"
         @click="goBack()" />
      <van-icon name="wap-home-o"
                @click="$router.push('/')" />
    </div>

    <!-- 底部控制按钮 -->
    <div v-show="control"
         class="btnControl">
      <!-- 章节信息 -->
      <div class="botChapter">
        <i class="iconfont icon-left"
           @click="switchingChapters('prev')" />
        <span class="botChapterTitle"> {{ chapterTitle }}</span>
        <i class="iconfont icon-right"
           @click="switchingChapters('next')" />
      </div>
      <!-- 控制按钮 -->
      <div class="btnMenu">
        <!-- menu -->
        <div @click="changeCatalogue">
          <!-- <i class="iconfont icon-menu" /> -->
          <img :src="require(`../../assets/img/reader/${imgColor}/menu.png`)"
               alt="" />
        </div>
        <!-- light/night -->
        <div @click="lightBlack">
          <!-- <i v-if="light" class="iconfont icon-taiyang" /> -->
          <!-- <i v-else class="iconfont icon-yueliang" /> -->
          <img v-if="light"
               :src="require(`../../assets/img/reader/${imgColor}/light.png`)"
               alt="" />
          <img v-else
               :src="require(`../../assets/img/reader/${imgColor}/night.png`)"
               alt="" />
        </div>
        <!-- size -->
        <div @click="showPoup = true">
          <!-- <i class="iconfont icon-font-size" /> -->
          <img :src="require(`../../assets/img/reader/${imgColor}/size.png`)"
               alt="" />
        </div>
        <!-- comment -->
        <div @click="jumpComment">
          <img :src="require(`../../assets/img/reader/${imgColor}/comment.png`)"
               alt="" />
        </div>
      </div>
    </div>
    <!-- 添加到书架 -->
    <div v-show="control && collectStatus === 0"
         class="addToLibrary"
         @click="getCollect">
      <i class="iconfont icon-weishoucang" />
      <span style="padding-left: 0.2rem"> {{$t('read.addLibrary')}}</span>
    </div>

    <!-- <div class="bot-info"
         v-show="control">
      <span>Tap</span>
      <img src="~img/common/share.jpg"
           alt="">
      <span>and then</span>
      <img src="~img/common/add.jpg"
           alt="">
      <span class="add-home">Add To Home Screen</span>
    </div> -->
    <!-- 控制开关弹出框 -->
    <van-popup v-model="showPoup"
               round
               position="bottom"
               class="popup"
               @open="openControlPoup">
      <!-- 控制开关 -->
      <div class="lockChapter">
        <van-switch v-model="checked"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="rgb(97, 85, 181)"
                    inactive-color="#dcdee0"
                    class="switch"
                    @change="switchChange" />
        <span>{{$t('read.autoUnlock')}}</span>
      </div>
      <!-- 设置字体大小 -->
      <div class="setFont">
        <div class="leftFont"
             @click="changeSize('smaller')">Aa-</div>
        <div class="midFont">{{ rootFontSize }}</div>
        <div class="rightFont"
             @click="changeSize('bigger')">Aa+</div>
      </div>
      <!-- 设置颜色 -->
      <div class="setColor">
        <div class="colorList color1"
             :class="borderColor === 'light' ? 'lightBorder' : ''"
             @click="setColor('light')" />
        <div class="colorList color2"
             :class="borderColor === 'yellow' ? 'yellowBorder' : ''"
             @click="setColor('yellow')" />
        <div class="colorList color3"
             :class="borderColor === 'green' ? 'greenBorder' : ''"
             @click="setColor('green')" />
      </div>
    </van-popup>
    <Catalogue ref="catalogue"
               :show="showCatalogue"
               :show-top-info="true"
               :closepoup.sync="showCatalogue"
               :reader="true"
               :active-id="activeId"
               @jumpReader="jumpReader" />
    <!-- loading -->
    <Loading :loading="showLoading" />
    <Login :showLogin="showLogin"
           @closePopup="closePopup" />
  </div>
</template>

<script>
// 防抖函数
const delay = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
import {
  chapterText,
  testAutoSub,
  setAutoSub,
  buyChapter,
  userAssets,
  collect,
  userCheck,
  upRead,
  readTime
} from "@/http/api";
import Catalogue from "@/components/Catalogue";
import Login from "@/components/User/login";
import { openReader, readChapter } from "@/utils/fbq";
import Loading from "@/components/Loading";

export default {
  components: { Catalogue, Login, Loading },
  data () {
    return {
      data: [],
      list: [],
      error: false,
      loading: false,
      finished: false,
      bookInfoParams: {},
      next_chapter: null,
      chapterTitle: "",
      control: false,
      showPoup: false,
      showCatalogue: false,
      light: true,
      checked: 0,
      activeId: null,
      newChapterInfo: {},
      borderColor: "",
      colorWrap: "",
      balance: null,
      collectStatus: 0,
      rootFontSize: 20,
      rootFontClass: "",
      showLogin: false, // 是否登录
      status: false,
      showLoading: false,
      time: 0,//定时器加事件
      interval: null,//最后触发的事件
    };
  },
  // metaInfo: {
  //   title: '',
  //   meta: [
  //     { name: 'keywords', content: '' },
  //     { name: 'description', content: '' },
  //     { property: 'og:url', content: '' }
  //   ],
  // },
  computed: {
    imgColor () {
      let src;
      switch (this.colorWrap) {
        case "":
          src = 999;
          break;
        case "greenWrap":
          src = 333;
          break;
        case "yellowWrap":
          src = 333;
          break;
        case "blackWrap":
          src = "b2b2b2";
          break;
        default:
          break;
      }
      return src;
    },
  },
  watch: {
    // status(n, o) {
    //   if (n) {
    //     console.log(n, o);
    //     this.onLoad();
    //   }
    // },
  },
  created () { },
  mounted () {
    // 刚进入页面的时候对主题颜色进行判断并进行设置
    this.getThemeColorAndSet();
    this.getParams();
    this.getchapterText();
    this.getCollectStatus();
    this.getFontSize();
    openReader(this.bookInfoParams.book_id);
    // 监听用户页面行为
    this.handelTimeData()
    // 如果需要刷新置0看这个
    // window.addEventListener('beforeunload', e => this.beforeunloadHandler())
    this.upRead()
  },
  methods: {
    // beforeunloadHandler () {
    //   this.$cookie.set('time', 0)
    // }
    // ,
    getParams () {
      const bookId = this.$route.query.book_id;
      const chapterId = this.$route.query.chapter_id;
      this.bookParams = {
        book_id: bookId,
        chapter_id: chapterId,
      };
      this.requireParams = JSON.parse(this.$cookie.get("requireParams"));
      this.bookInfoParams = Object.assign(this.requireParams, this.bookParams);
    },
    getchapterText () {
      this.data = [];
      this.status = false;
      this.showLoading = true;
      chapterText(this.bookInfoParams)
        .then((res) => {
          this.status = true;
          this.data.push(res.data);
          this.next_chapter = Number(res.data.next_chapter);
          this.chapterTitle = res.data.chapter_title;
          this.activeId = res.data.chapter_id;
          this.newChapterInfo = res.data;
          this.getUserAssets();
          this.setBookInfo(res);
          readChapter(this.bookInfoParams.book_id);
          this.finished = false;
          this.showLoading = false;
          this.loading = false;
          //  this.$router.push({ query: {'book_id': res.data.book_id,chapter_id:res.data.chapter_id}})
        })
        .catch(() => {
          this.error = true;
        });
    },
    upRead() { // 上报数据
      upRead(Object.assign(JSON.parse(this.$cookie.get("requireParams")), {book_id: this.bookParams.book_id})).then(res => {})
    },
    // 每次获取文章的时候都把文章id和章节存在cookie里面
    setBookInfo (res) {
      const bookParams = {
        book_id: res.data.book_id,
        chapter_id: res.data.chapter_id,
      };
      this.$cookie.set("bookParams", JSON.stringify(bookParams), 1);
    },
    // list中的文章列表
    onLoad () {
      // if (this.status) {
      if (this.next_chapter != null || this.next_chapter !== 0) {
        this.bookInfoParams.chapter_id = this.next_chapter;
        chapterText(this.bookInfoParams)
          .then((res) => {
            // 加载状态结束
            this.loading = false;
            this.data.push(res.data);
            this.next_chapter = Number(res.data.next_chapter);
            this.chapterTitle = res.data.chapter_title;
            this.activeId = res.data.chapter_id;
            this.newChapterInfo = res.data;
            this.getUserAssets();
            this.setBookInfo(res);
            //  this.$router.push({ query: {'book_id': res.data.book_id,chapter_id:res.data.chapter_id}})
            // 数据全部加载完成
            if (res.data.next_chapter === "" || this.next_chapter === 0) {
              this.finished = true;
            }
          })
          .catch(() => {
            this.error = true;
          });
      } else {
        this.finished = true;
      }
      // }
    },
    // 判断是夜间模式还是日间模式
    lightBlack () {
      this.light = !this.light;
      if (this.light === false) {
        this.$cookie.set("themeColor", "black", 1);
      } else {
        this.$cookie.set("themeColor", "light", 1);
      }
      this.getThemeColorAndSet();
    },
    // 显示目录
    changeCatalogue () {
      this.showCatalogue = true;
    },
    // 目录的点击事件
    jumpReader (params) {
      this.showCatalogue = false;
      this.bookInfoParams = JSON.parse(this.$cookie.get("requireParams"));
      this.bookInfoParams.book_id = params.book_id;
      this.bookInfoParams.chapter_id = params.chapter_id;
      this.getchapterText();
      this.control = false;
      this.$router.push({
        query: { book_id: params.book_id, chapter_id: params.chapter_id },
      });
    },
    // 跳转评论
    jumpComment () {
      this.$router.push({
        path: "comment",
        query: { book_id: this.bookInfoParams.book_id },
      });
    },
    // 底部控制开关打开的时候的方法
    openControlPoup () {
      // 获取当前的颜色主题  给颜色设置块增加border
      const themeColor = this.$cookie.get("themeColor");
      this.setBorderColor(themeColor);
      // 检测是否开启了自动订阅
      this.textOpenSub();
    },
    setBorderColor (color) {
      switch (color) {
        case "light":
          this.borderColor = "light";
          this.light = true;
          break;
        case "green":
          this.borderColor = "green";
          break;
        case "yellow":
          this.borderColor = "yellow";
          break;
        default:
          this.borderColor = "";
          this.light = false;
          break;
      }
    },
    // 设置控制弹窗里面的颜色边框
    setColor (color) {
      this.$cookie.set("themeColor", color, 1);
      this.borderColor = color;
      this.openControlPoup();
      this.getThemeColorAndSet();
    },
    // 切换章节
    switchingChapters (target) {
      if (target === "prev") {
        this.bookInfoParams.chapter_id = this.newChapterInfo.last_chapter;
        if (this.bookInfoParams.chapter_id === 0) {
          this.$toast("This is the first chapter");
        } else {
          this.getchapterText();
        }
      } else if (target === "next") {
        this.bookInfoParams.chapter_id = this.newChapterInfo.next_chapter;
        if (this.bookInfoParams.chapter_id === 0) {
          this.$toast("This is the last chapter");
        } else {
          this.getchapterText();
        }
      }
    },
    // 打开的时候检测是否开启了自动购买下一章
    textOpenSub () {
      testAutoSub(JSON.parse(this.$cookie.get("requireParams"))).then((res) => {
        this.checked = res.data.auto_sub;
      });
    },
    // 自动订购下一章开关
    switchChange () {
      setAutoSub(JSON.parse(this.$cookie.get("requireParams"))).then((res) => {
        this.checked = res.data.auto_sub;
      });
    },
    // 打开页面设置主题色
    getThemeColorAndSet () {
      switch (this.$cookie.get("themeColor")) {
        case "light":
          this.colorWrap = "";
          this.light = true;
          break;
        case "green":
          this.colorWrap = "greenWrap";
          break;
        case "yellow":
          this.colorWrap = "yellowWrap";
          break;
        case "black":
          this.colorWrap = "blackWrap";
          this.light = false;
          break;
        default:
          break;
      }
    },
    // 购买章节
    buyThisChapter (item) {
      const data = {
        book_id: item.book_id,
        chapter_id: item.chapter_id,
      };
      buyChapter(Object.assign(this.requireParams, data)).then((res) => {
        // 判断是否登录
        if (res.code == 299) {
          // 跳转登录
          this.showLogin = true;
          return;
        }

        // 余额不足跳转支付页
        if (res.code == 802) {
          this.$router.push({
            path: "recharge",
            query: { redirect: encodeURIComponent(window.location.href) },
          });
        }

        if (res.code === 0) {
          this.data = [];
          this.showLoading = true;
          // 返回参数成功之后 调用获取购买章节接口
          chapterText(Object.assign(this.requireParams, data))
            .then((res) => {
              console.log(res);
              this.showLoading = false;
              this.data.push(res.data);
              this.next_chapter = Number(res.data.next_chapter);
              this.chapterTitle = res.data.chapter_title;
              this.activeId = res.data.chapter_id;
              this.newChapterInfo = res.data;
              this.setBookInfo(res);
              this.$refs["catalogue"].getcatalog();

              // chrome
              document.body.scrollTop = 0;
              // firefox
              document.documentElement.scrollTop = 0;
              // safari
              window.pageYOffset = 0;
              this.getUserAssets();
            })
            .catch((res) => {
              this.error = true;
            });
        } else {
          this.$toast(res.msg);
        }
      });
    },
    // 获取用户余额
    getUserAssets () {
      userAssets(this.requireParams).then((res) => {
        this.balance = res.data.remain;
      });
    },
    // 检测收藏并更改状态
    getCollect () {
      userCheck(this.$cookie.get("requireParams")).then((res) => {
        if (res.code) {
          // 未登录，弹框登录
          this.showLogin = true;
          return;
        }
        collect(
          Object.assign(JSON.parse(this.$cookie.get("requireParams")), {
            book_id: this.data[0].book_id,
          })
        ).then((res) => {
          this.collectStatus = res.data.is_collect;
          if (res.data.is_collect === 0) {
            this.$toast(this.$t('detail.removeLibrary'));
          } else {
            this.$toast(this.$t('detail.addLibrary'));
          }
        });
      });
    },
    // 打开页面的时候获取当前书本是否已经收藏
    getCollectStatus () {
      this.collectStatus = Number(this.$cookie.get("is_collect"));
    },
    // 改变文字大小
    changeSize (action) {
      const fontSize = this.$cookie.get("rootFontSize");
      let num = fontSize;
      if (action === "smaller") {
        num -= 2;
        if (num <= 20) {
          num = 20;
        }
      } else if (action === "bigger") {
        num = Number(num) + 2;
        if (num >= 50) {
          num = 50;
        }
      }
      this.rootFontSize = num;
      this.$cookie.set("rootFontSize", this.rootFontSize, 1);
      this.getFontSize();
    },
    // 页面打开的时候获取字体大小
    getFontSize () {
      const size = this.$cookie.get("rootFontSize");
      if (size === null) {
        this.rootFontSize = 30;
        this.$cookie.set("rootFontSize", 30, 1);
        console.log(typeof size);
      } else {
        this.rootFontSize = size;
      }
      const fontclass = "fs" + this.rootFontSize;
      this.rootFontClass = fontclass;
    },
    closePopup () {
      // 关闭弹窗
      this.showLogin = false;
    },
    goBack () {
      this.$router.push({
        path: "/detail",
        query: { book_id: this.bookInfoParams.book_id },
      });
    },
    //设置定时器
    setTimer () {
      // 开启定时器之前先清除定时器
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        // 判断cookie里面有没有这个 如果没有 就从0开始 如果有 就从cookie中的数据上加
        if (Number(this.$cookie.get('time')) === 0) {
          this.time = 0
        } else {
          this.time = Number(this.$cookie.get('time'))
        }

        // 上报数据
        if (this.time > 30) {
          const timeData = Object.assign(JSON.parse(this.$cookie.get("requireParams")), {read_time: this.time, content_id: this.bookParams.book_id, content_type: 1})
          readTime(timeData).then(() => {
            this.time = 0;
            this.$cookie.set('time', this.time)
          })
        }
        // console.log(this.time);
        this.time++;
        this.$cookie.set('time', this.time)
      }, 1000);
    },
    // 设置一个十秒的防抖函数 10秒内每次点击的时候将倒计时清0 
    debounceClick () {
      this.setTimer()
      delay(() => {
        clearInterval(this.interval);
      }, 10000)
    },
    // 处理用户把应用切到后台之后的操作
    handelTimeData () {
      this.setTimer()
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          clearInterval(this.interval);
        } else {
          // 切回来的事件
          this.setTimer()
        }
      });
    }
  },
  // 离开页面的时候触发的方法
  beforeRouteLeave (to, form, next) {
    // 这里可以放一个给服务端发送数据的方法 发送this.time 然后将cookie置为空
    console.log('离开');
    this.$cookie.set('time', 0)
    console.log(this.$cookie.get('time'));
    next()
  },
  //页面销毁前关闭定时器 
  beforeDestroy () {
    clearInterval(this.interval);
    this.$cookie.set('time', 0)
  },

};
</script>
<style lang="scss" scoped>
.min {
  overflow-y: scroll;
  text-align: left;
  h1 {
    font-weight: 700;
    line-height: 1.5;
    color: #1a1a1a;
    padding: 0.9375rem;
    font-size: 1rem;
  }
  p {
    padding: 0.9375rem;
    white-space: pre-wrap;
    text-align: left;
    line-height: 2;
  }
  .itemBox {
    background: #fafbff;
  }
  .lockBox {
    padding-bottom: 34vh;
    .lockWrap {
      width: 23.4375rem;
      height: 24.3125rem;
      background: #fff;
      border: 0.09375rem solid #9b8cff;
      border-radius: 4rem 4rem 0 0;
      box-sizing: border-box;
      padding-bottom: 2.5rem;
      .toLock {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 2.625rem;
        img {
          width: 9.84375rem;
          height: 6.9375rem;
        }
        span {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.40625rem;
          color: #333;
          margin-top: 0.8125rem;
          width: 18.4375rem;
          text-align: center;
        }
        .btn {
          width: 18.4375rem;
          height: 3.0625rem;
          background: #9b8cff;
          border-radius: 1.875rem;
          text-align: center;
          line-height: 3.0625rem;
          color: #fff;
          font-size: 1rem;
          margin-top: 2.8125rem;
        }
        .balance {
          margin-top: 3.125rem;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          .balanceNumber {
            color: #b3b3b3;
            font-size: 1rem;
            margin-top: 0%;
            width: unset;
          }
          .balanceImg {
            width: 1.125rem;
            height: 1.125rem;
          }
        }
      }
    }
  }
}
.topBack {
  position: fixed;
  top: 0;
  left: 0;
  height: 2.6875rem;
  width: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  i {
    padding-left: 0.9375rem;
    height: 100%;
    font-size: 1.125rem;
    color: #333;
    line-height: 2.6875rem;
  }
  .van-icon-wap-home-o {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
}
.btnControl {
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  background: #fff;
  position: fixed;
  .botChapter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.75rem;
    width: 100%;
    font-size: 0.875rem;
    i {
      padding: 0 1.25rem;
    }
    .botChapterTitle {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding: 0 0.5rem;
    }
  }
}
.btnMenu {
  width: 100%;
  height: 3.0625rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  div {
    width: 6.25rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #999;
    // i {
    //   font-size: 1.5rem;
    // }
    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
// 添加到书架
.addToLibrary {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: 2.25rem;
  background: #9b8cff;
  box-shadow: 0 0.3125rem 0.625rem #cdb7ff33;
  opacity: 1;
  border-radius: 1.125rem;
  top: 68%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  line-height: 2.25rem;
  color: #fff;
  padding: 0 1.31rem;
  position: fixed;
  font-size: 0.9rem;
}
// 添加桌面信息
.bot-info {
  background-color: #fff;
  position: absolute;
  bottom: 7.5rem;
  width: 90%;
  margin-left: 5%;
  height: 3rem;
  line-height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
  box-shadow: 0 0 0.5rem #ddd;
  img {
    width: 1rem;
    height: 1rem;
    margin: 0 0.2rem;
  }
  .add-home {
    color: #333;
    font-weight: 500;
    font-size: 0.9rem;
  }
}
.note-icon {
  position: absolute;
  bottom: 1rem;
  left: calc(50% - 0.5rem);
  font-size: 0.7rem;
  .trangle {
    width: 0px;
    height: 0px;
    font-size: 0.8rem;
    border: 0.5rem solid #fff;
    border-top-color: white;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
  }
}

// 弹出框
.popup {
  height: 14.875rem;
  background: #fdfdfd;
  box-shadow: 0 -0.625rem 1.875rem #6b6a6e1a;
  border-radius: 1.875rem 1.875rem 0 0;
  padding: 2.5rem 0.9375rem 2.3125rem;
  .lockChapter {
    height: 2.8rem;
    display: flex;
    align-items: center;
    border-bottom: 0.03125rem solid #e6e6e6;
    padding-bottom: 1.40625rem;
    box-sizing: content-box;
    .switch {
      font-size: 0.9375rem;
      margin: 0 0.8125rem 0 0.3125rem;
      height: 1.1em;
    }
    span {
      font-size: 0.75rem;
      color: #aaa8b3;
    }
  }
  .setFont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.125rem;
    .leftFont,
    .rightFont {
      width: 8.25rem;
      height: 2.25rem;
      background: #f7f7f2;
      border-radius: 1.125rem;
      line-height: 2.25rem;
      text-align: center;
      color: #5b5e63;
      font-size: 1rem;
    }
    .midFont {
      font-size: 1.5rem;
      color: #2f2e33;
    }
  }
  // 颜色设置
  .setColor {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.75rem;
    .colorList {
      width: 6.71875rem;
      height: 2rem;
      border-radius: 1rem;
      box-sizing: border-box;
    }
    .color1 {
      background: #f5f6fa;
    }
    .color2 {
      background: #f8f2da;
    }
    .color3 {
      background: #c2fcc9;
    }
  }
}

// 黑色主题的时候
.blackWrap {
  background: #000;
  .topBack,
  .btnControl {
    background: #2d2e33 !important;
    color: #b2b2b2 !important;
    i {
      color: #b2b2b2 !important;
    }
  }
  .itemBox {
    background: #000;
    color: #ccc;
    h1 {
      color: #ccc;
    }
    .lockBox {
      .lockWrap {
        background: #2d2e33;
        border: 0.09375rem solid #525252;
        color: #ccc !important;
        .toLock {
          span {
            color: #ccc;
          }
        }
      }
    }
  }
  .midFont {
    color: #b3b3b3 !important;
  }
  /deep/.van-loading--circular {
    background: #000;
    color: #ccc;
  }
  /deep/.van-popup--bottom {
    background: #2d2e33;
    color: #aaa8b3;
  }
}
// 绿色主题的时候
.greenWrap {
  background: #bef7c5;
  .topBack {
    background: #bef7c5 !important;
    i {
      color: #333 !important;
    }
  }
  .btnControl {
    background: #c2f2c7 !important;
    color: #5b5e63 !important;
    i {
      color: #5b5e63 !important;
    }
  }
  .itemBox {
    background: #bef7c5;
    color: #000200;
    h1 {
      color: #000200;
    }
    .lockBox {
      .lockWrap {
        background: #ceffd8;
        border: 0.09375rem solid #9b8cff;
        color: #333 !important;
        .toLock {
          span {
            color: #333;
          }
        }
      }
    }
  }
  .addToLibrary {
    background: #35c94c;
  }
  // /deep/.van-loading--circular{
  //   background: #000;
  //   color: #ccc;
  // }
  .midFont {
    color: #2f2e33;
  }
  /deep/.van-popup--bottom {
    background: #ceffd8;
    color: #aaa8b3;
  }
}
// 黄色主题的时候
.yellowWrap {
  background: #f8f2da;
  .topBack {
    background: #f6f0da !important;
    i {
      color: #5b5e63 !important;
    }
  }
  .btnControl {
    background: #f7f1d9 !important;
    color: #5b5e63 !important;
    i {
      color: #5b5e63 !important;
    }
  }
  .itemBox {
    background: #f8f2da;
    color: #292000;
    h1 {
      color: #292000;
    }
    .lockBox {
      .lockWrap {
        background: #f6f0da;
        border: 0.09375rem solid #9b8cff;
        color: #333 !important;
        .toLock {
          span {
            color: #333;
          }
        }
      }
    }
  }
  .addToLibrary {
    background: #ffa826;
  }
  // /deep/.van-loading--circular{
  //   background: #000;
  //   color: #ccc;
  // }
  .midFont {
    color: #2f2e33;
  }
  /deep/.van-popup--bottom {
    background: #f6f0da;
    color: #5b5e63;
  }
}
// 设置三种默认选中样式
.lightBorder {
  border: 0.0625rem solid #9a8cff;
}
.yellowBorder {
  border: 0.0625rem solid #c6a11c;
}
.greenBorder {
  border: 0.0625rem solid #006712;
}
</style>
<style lang="scss" scoped>
.fs50 {
  .chapterTitle {
    font-size: 1.6875rem;
  }
  .chapterContent {
    font-size: 1.5625rem;
  }
}
.fs48 {
  .chapterTitle {
    font-size: 1.625rem;
  }
  .chapterContent {
    font-size: 1.5rem;
  }
}
.fs46 {
  .chapterTitle {
    font-size: 1.5625rem;
  }
  .chapterContent {
    font-size: 1.4375rem;
  }
}
.fs44 {
  .chapterTitle {
    font-size: 1.5rem;
  }
  .chapterContent {
    font-size: 1.375rem;
  }
}
.fs42 {
  .chapterTitle {
    font-size: 1.4375rem;
  }
  .chapterContent {
    font-size: 1.3125rem;
  }
}
.fs40 {
  .chapterTitle {
    font-size: 1.375rem;
  }
  .chapterContent {
    font-size: 1.25rem;
  }
}
.fs38 {
  .chapterTitle {
    font-size: 1.3125rem;
  }
  .chapterContent {
    font-size: 1.1875rem;
  }
}
.fs36 {
  .chapterTitle {
    font-size: 1.25rem;
  }
  .chapterContent {
    font-size: 1.125rem;
  }
}
.fs34 {
  .chapterTitle {
    font-size: 1.1875rem;
  }
  .chapterContent {
    font-size: 1.0625rem;
  }
}
.fs32 {
  .chapterTitle {
    font-size: 1.125rem;
  }
  .chapterContent {
    font-size: 1rem;
  }
}
.fs30 {
  .chapterTitle {
    font-size: 1.0625rem;
  }
  .chapterContent {
    font-size: 0.9375rem;
  }
}
.fs28 {
  .chapterTitle {
    font-size: 1rem;
  }
  .chapterContent {
    font-size: 0.875rem;
  }
}
.fs26 {
  .chapterTitle {
    font-size: 0.9375rem;
  }
  .chapterContent {
    font-size: 0.8125rem;
  }
}
.fs24 {
  .chapterTitle {
    font-size: 0.875rem;
  }
  .chapterContent {
    font-size: 0.75rem;
  }
}
.fs22 {
  .chapterTitle {
    font-size: 0.8125rem;
  }
  .chapterContent {
    font-size: 0.6875rem;
  }
}
.fs20 {
  .chapterTitle {
    font-size: 0.75rem;
  }
  .chapterContent {
    font-size: 0.625rem;
  }
}
</style>
