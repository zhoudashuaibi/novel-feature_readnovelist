<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-06 12:52:39
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 15:31:35
-->
<!--  -->
<template>
  <div class="mh">
    <!-- 骨架屏 -->
    <div v-if="loading" class="van-skeleton--animate skeleton">
      <div class="top">
        <p class="img"></p>
        <p class="goback" @click="$router.go(-1)">
          <i class="icon-fanhui iconfont" />
        </p>
      </div>
      <div class="main">
        <div class="title">
          <van-skeleton class="h1" :row="2" />
          <p class="right"></p>
        </div>
        <div class="category">
          <p class="left"></p>
          <p class="right"></p>
        </div>
        <div class="number">
          <p class="block"></p>
          <p class="block"></p>
        </div>
        <div class="detail">
          <van-skeleton :row="4" />
        </div>
        <div class="chapter">
          <div class="left">
            <van-skeleton :row="2" row-width="70%" />
          </div>
          <p class="right"></p>
        </div>
        <div class="comments">
          <div class="commenttop">
            <p></p>
            <p></p>
          </div>
          <div class="bottom">
            <van-skeleton title avatar :row="3" />
          </div>
        </div>
      </div>
    </div>
    <!-- 正式的内容区域 -->
    <div v-else>
      <div class="minBox">
      <!-- 顶部区域 -->
      <div class="top">
        <img class="bookImg" :src="dataInfo.cover" alt="" />
        <div class="goback" @click="$router.go(-1)">
          <i class="icon-fanhui iconfont" />
        </div>
      </div>
      <!-- 主要中间区域 -->
      <div class="main">
        <div class="title">
          <h1 class="line2">{{ dataInfo.name }}</h1>
          <div class="right" @click="getCollect">
            <i
              v-if="dataInfo.is_collect === 1"
              class="iconfont icon-shoucang"
            />
            <i v-else class="iconfont icon-weishoucang" />
          </div>
        </div>
        <div class="category">
          <div class="box clearfix">
            <div v-for="(item, index) in tag" :key="index" class="left">
              {{ item.tab }}
            </div>
            <div class="left" style="background: #f9cd49; color: #fff; min-width: 3.9rem;">{{ dataInfo.finished }}</div>
          </div>
          <!-- <div class="right fr">{{ dataInfo.finished }}</div> -->
        </div>
        <div class="number">
          <div class="list">
            <p class="title">{{ dataInfo.total_views }}</p>
            <p class="info">{{$t('detail.read')}}</p>
          </div>
          <div class="list">
            <p class="title">{{ dataInfo.favors }}</p>
            <p class="info">{{$t('detail.like')}}</p>
          </div>
        </div>
        <!-- <div class="tag">
          <div v-for="(item , index ) in tag" :key="index" class="tagItem"> {{ item.tab }} </div>
        </div> -->
        <div
          class="detail"
          :style="{ display: descOpen ? 'block' : '-webkit-box' }"
          @click="openClose"
        >
          {{ dataInfo.description }}
          <van-icon name="arrow-down" v-show="!descOpen" />
        </div>
        <div class="chapter" @click="showCatalogue = true">
          <div class="chapterleft">
            <p class="chaptertop">
              {{ dataInfo.last_chapter_title }}
            </p>
            <p class="chapterbot">
              {{ dataInfo.last_chapter_time }}
            </p>
          </div>
          <i class="iconfont icon-xiayiye chapterI" />
        </div>
        <!-- 评论区域 -->
        <div class="comments">
          <div class="commenttitle">
            <h2 class="Commoents">{{$t('detail.comment')}}</h2>
            <div
              class="viewall"
              v-if="dataInfo.comment_num > 0"
              @click="jumpToViews"
            >
              {{$t('detail.viewAll')}} ({{ dataInfo.comment_num }}) <van-icon name="arrow" />
            </div>
            <div class="viewall" v-else @click="jumpToViews">{{$t('detail.write')}}</div>
          </div>
          <div class="comment" v-if="dataInfo.comment_num > 0">
            <div
              class="commentBox"
              v-for="(item, index) in dataInfo.comments"
              :key="index"
            >
              <div class="commentleft">
                <img :src="item.avatar" @error="defImg" />
              </div>
              <div class="commentright">
                <h3>{{ item.nickname }}</h3>
                <p>{{ item.content }}</p>
                <div class="time">
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="noComment">
            <img src="~img/detail/noComments.png" alt="" />
          </div>
        </div>
        <div style="padding-bottom: 2rem" />
        <!-- 根据用户阅读状态 显示不同的用户阅读信息 -->
        <div class="bottomBtn">
          <div
            v-if="dataInfo.last_read_id === 0"
            class="reading"
            @click="jumpToReader"
          >
            {{$t('detail.start')}}
          </div>
          <div v-else class="reading" @click="jumpToReader">
            {{$t('detail.continue')}}
          </div>
        </div>
      </div>
    </div>
    </div>
    <!-- 目录 -->
    <Catalogue
      :show="showCatalogue"
      :closepoup.sync="showCatalogue"
      :active-id="dataInfo.last_read_id"
    />
    <!-- loading -->
    <!-- <Loading :loading="true" /> -->
    <Login :showLogin="showLogin" @closePopup="closePopup" />
  </div>
</template>

<script>
import Catalogue from "@/components/Catalogue";
import { bookInfo, collect, userCheck } from "@/http/api";
import { Toast } from "vant";
import Loading from "@/components/Loading";
import Login from "@/components/User/login";
import { addShelf, openInfo } from "@/utils/fbq";

export default {
  components: { Catalogue, Loading, Login },
  data() {
    return {
      showCatalogue: false,
      tag: [],
      dataInfo: {
        cover: require("img/common/default-cover.png"),
      },
      book_id: 0,
      chapter_id: null,
      showLogin: false,
      descOpen: false, // 描述展开，默认不展开
      defaultImg: require("img/discover/default-avatar.png"),
      loading: false,
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
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.book_id = this.$route.query.book_id;
    console.log(this.book_id);
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      bookInfo(
        Object.assign(JSON.parse(this.$cookie.get("requireParams")), {
          book_id: this.book_id,
        })
      ).then((res) => {
        this.tag = res.data.tag;
        this.dataInfo = res.data;
        this.loading = false;
        this.$cookie.set("is_collect", res.data.is_collect, 1);
        openInfo(this.book_id);
      });
    },
    // 检测收藏并更改状态
    getCollect() {
      userCheck(this.$cookie.get("requireParams")).then((res) => {
        if (res.code) {
          // 未登录，弹框登录
          this.showLogin = true;
          return;
        }
        collect(
          Object.assign(JSON.parse(this.$cookie.get("requireParams")), {
            book_id: this.book_id,
          })
        ).then((res) => {
          this.dataInfo.is_collect = res.data.is_collect;
          this.$cookie.set("is_collect", res.data.is_collect, 1);
          if (res.data.is_collect === 0) {
            Toast(this.$t('detail.removeLibrary'));
          } else {
            Toast(this.$t('detail.addLibrary'));
            addShelf(this.book_id);
          }
          console.log(this.$cookie.get("is_collect"));
        });
      });
    },
    // 跳转到小说阅读器
    jumpToReader() {
      const params = {
        book_id: this.book_id,
        chapter_id: this.chapter_id,
      };
      // if (this.dataInfo.last_read_id === 0) {
      //   params.chapter_id = null;
      // } else {
      //   params.chapter_id = this.dataInfo.last_read_id;
      // }

      this.$cookie.set("bookParams", JSON.stringify(params), 1);
      const chapter = this.dataInfo.last_read_id;
      if (chapter === 0) {
        this.$router.push({
          path: "/reader",
          query: { book_id: this.book_id },
        });
      } else {
        this.$router.push({
          path: "/reader",
          query: { book_id: this.book_id, chapter_id: chapter },
        });
      }
    },
    closePopup() {
      // 关闭弹窗
      this.showLogin = false;
    },
    openClose() {
      this.descOpen = !this.descOpen;
    },
    jumpToViews() {
      this.$router.push({ path: "/comment", query: { book_id: this.book_id } });
    },
    defImg() {
      let img = event.srcElement;
      img.src = this.defaultImg;
      img.onerror = null; //防止闪图
    },
  },
};
</script>
<style lang="scss" scoped>
.minBox {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .top {
    width: 100%;
    height: 24.9375rem;
    position: relative;
    background: url("~img/detail/detailBg.png");
    background-size: 100% 100%;
    text-align: center;
    .bookImg {
      width: 8.71875rem;
      height: 11.65625rem;
      background: transparent;
      opacity: 1;
      border-radius: 0.25rem;
      margin-top: 3.75rem;
    }
    .goback {
      width: 2.4375rem;
      height: 2.4375rem;
      position: absolute;
      top: 0.9375rem;
      left: 0.9375rem;
      background: #000;
      background: rgba(0, 0, 0, 0.26);
      border-radius: 0.5rem;
      text-align: center;
      border-color: #fff;
      i {
        font-size: 1.25rem;
        line-height: 2.4375rem;
        color: #fff;
      }
    }
  }
  .main {
    position: relative;
    margin-top: -7.375rem;
    width: 100%;
    background: #fafbff;
    border-radius: 1.4375rem 1.4375rem 0 0;
    padding: 0.9375rem 0.9375rem 5.46875rem;
    box-sizing: border-box;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      width: 0;
      flex: 1;
      height: 3.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.875rem;
      color: #333;
      text-align: left;
    }
    .right {
      margin-left: 1.09375rem;
      width: 3.6875rem;
      height: 3.6875rem;
      background: #fff;
      border: 0.03125rem solid #fff;
      box-shadow: 0 0.3125rem 1.25rem #e6e0ff;
      border-radius: 50%;
      text-align: center;
      i {
        color: #ff6581;
        font-size: 2.2rem;
        line-height: 3.6875rem;
      }
    }
  }
  .category {
    margin-top: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box {
      // height: 1.625rem;
      overflow: hidden;
    }
    .left {
      padding: 0 0.625rem;
      line-height: 1.625rem;
      height: 1.625rem;
      border-radius: 0.8125rem;
      font-size: 0.875rem;
      background: #eeebff;
      color: #a088ff;
      float: left;
      margin-right: 0.3rem;
      margin-bottom: 0.3rem;
    }
    .right {
      background: #f9cd49;
      color: #fff;
      padding: 0 0.625rem;
      line-height: 1.625rem;
      height: 1.625rem;
      border-radius: 0.8125rem;
      font-size: 0.875rem;
      min-width: 3.9rem;
    }
  }
  .number {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    .list {
      width: 10.3125rem;
      height: 3.71875rem;
      background: #fff;
      box-shadow: 0 0.3125rem 1.25rem #f4f1ff;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .title {
        color: #333;
        font-size: 1.125rem;
      }
      .info {
        color: #c8c8d6;
        font-size: 0.875rem;
      }
    }
  }
  .tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.9375rem 0;
    max-height: 5.9375rem;
    overflow: hidden;
    border-bottom: 0.03125rem solid #e3e2ff;
    .tagItem {
      margin: 0.625rem 0.9375rem 0 0;
      height: 1.625rem;
      border: 0.03125rem solid #9b8cff;
      border-radius: 0.8125rem;
      line-height: 1.625rem;
      font-size: 0.875rem;
      color: #9b8cff;
      padding: 0 0.625rem;
    }
  }
  .detail {
    margin: 0.9375rem 0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #9f9fb1;
    text-align: left;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    position: relative;
    i {
      position: absolute;
      right: 0;
      bottom: -0.06rem;
      width: 50%;
      height: 1.25rem;
      font-size: 1rem;
      line-height: 1.25rem;
      padding-right: 0.1rem;
      text-align: right;
      display: block;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        #fafbff 70%,
        #fafbff
      );
    }
  }
  .chapter {
    height: 4.6875rem;
    border-bottom: 0.03125rem solid #e3e2ff;
    border-top: 0.03125rem solid #e3e2ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .chapterleft {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
      .chaptertop {
        max-width: 15.625rem;
        color: #9a8cff;
        font-size: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 0.625rem;
      }
      .chapterbot {
        margin-top: 0.3125rem;
        font-size: 0.75rem;
        color: #a6a6b3;
      }
    }
    .chapterI {
      font-size: 0.6875rem;
      color: #c8c8d6;
      margin-left: 0.625rem;
    }
  }
  .bottomBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    background: #fafbff;
    width: 100%;
    padding: 0.9375rem;
    .reading {
      width: 9.625rem;
      height: 2.625rem;
      background: linear-gradient(180deg, #c8baff, #977dff);
      box-shadow: 0 0.3125rem 0.9375rem #e4d7ff;
      border-radius: 1.875rem;
      line-height: 2.625rem;
      text-align: center;
      font-size: 1rem;
      color: #fff;
      margin: 0 auto;
    }
  }
  // 书籍评论
  .comments {
    .commentBox {
      position: relative;
    }
    .commentBox::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      left: 2.8rem;
      bottom: -0.2rem;
      border-bottom: 1px solid #ebedf0;
      transform: scaleY(0.5);
      width: 90%;
    }
    .commenttitle {
      display: flex;
      justify-content: space-between;
      padding: 0.9375rem 0;
      .Commoents {
        font-size: 1.25rem;
        font-weight: 700;
        color: #333;
        line-height: 1.25rem;
        height: 1.25rem;
      }
      .viewall {
        color: #9a8cff;
        font-size: 0.8125rem;
        line-height: 1.25rem;
        height: 1.25rem;
      }
    }
    .comment {
      .commentBox {
        display: flex;
        margin-bottom: 1rem;
        // justify-content: space-between;
        .commentleft {
          width: 3rem;
          border-radius: 50%;
          height: 2rem;
          img {
            width: 1.9rem;
            height: 1.9rem;
            border-radius: 50%;
            vertical-align: middle;
            display: inline-block;
          }
        }
        .commentright {
          text-align: left;
          h3 {
            height: 1.2rem;
            line-height: 1.2rem;
            font-size: 0.9rem;
          }
          p {
            padding: 0.3rem 0;
            font-size: 0.75rem;
            color: #666;
            width: 100%;
            max-width: 20rem;
          }
          .time {
            height: 1.5rem;
            line-height: 1.5rem;
            padding: 0.2rem 0;
            span {
              color: #cbcbcb;
              font-size: 0.6rem;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.skeleton {
  .top {
    width: 100%;
    height: 24.9375rem;
    position: relative;
    .img {
      width: 8.71875rem;
      height: 11.65625rem;
      border-radius: 0.25rem;
      top: 3.75rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .goback {
      width: 2.4375rem;
      height: 2.4375rem;
      position: absolute;
      top: 0.9375rem;
      left: 0.9375rem;
      text-align: center;
      border-color: #fff;
      i {
        font-size: 1.25rem;
        line-height: 2.4375rem;
        color: #fff;
      }
    }
  }
  .main {
    position: relative;
    margin-top: -7.375rem;
    width: 100%;
    background: #fafbff;
    border-radius: 1.4375rem 1.4375rem 0 0;
    padding: 0.9375rem 0.9375rem 5.46875rem;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .h1 {
        width: 17rem;
      }
      .right {
        margin-left: 1.09375rem;
        width: 3.6875rem;
        height: 3.6875rem;
        background: #fff;
        border: 0.03125rem solid #fff;
        border-radius: 50%;
        text-align: center;
        i {
          color: #ff6581;
          font-size: 2.2rem;
          line-height: 3.6875rem;
        }
      }
    }
    .category {
      display: flex;
      justify-content: space-between;
      margin-top: 0.625rem;
      .left,
      .right {
        padding: 0 0.625rem;
        height: 1.625rem;
        border-radius: 0.8125rem;
        min-width: 3.9rem;
      }
    }
    .number {
      margin-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      .block {
        width: 10.3125rem;
        height: 3.71875rem;
      }
    }
    .detail {
      margin: 0.9375rem 0;
    }
    .chapter {
      height: 4.6875rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        width: 10rem;
      }
      .right {
        width: 1.5rem;
        height: 1rem;
      }
    }
    .comments {
      .commenttop {
        display: flex;
        justify-content: space-between;
        padding: 0.9375rem 0;
        p {
          width: 5rem;
          height: 1.25rem;
        }
      }
    }
  }
}
</style>
