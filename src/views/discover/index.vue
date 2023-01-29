<template>
<div>
  
    <AddDesktop/>
 <van-sticky >
        <div class="header">
          <img src="~img/common/name.png" class="logo" alt="" />
          <div class="header-right">
            <div class="header-shadow search" @click="showSearch = true">
              <img src="~img/common/search.png" alt="" />
            </div>
            <div class="header-shadow" @click="jupmToGenre">
              <img src="~img/discover/menu.png" class="menu" alt="" />
            </div>
          </div>
        </div>
      </van-sticky>
  <div class="all">
    
    <!-- 骨架屏 -->
    <div class="skeleton van-skeleton--animate"  v-if="skeleton">
      <div class="top">
        <p class="logo"></p>
        <div class="right">
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="swiper"> 
        <p class="left"></p>
        <p class="middle"></p>
        <p class="right"></p>
      </div>
      <div class="contents">
        <div class="title">
          <p class="left"></p>
          <p class="right"></p>
        </div>
        <div class="contentbox">
          <div class="item" v-for="i in 6" :key="i">
            <p class="img"></p>
            <van-skeleton class="text" :row="2" :row-width="['100%', '40%']" />
          </div>
          <div class="btn"></div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <!-- 顶部 -->
    <div v-else>
       

      <!-- 轮播图 -->
      <Swiper :list="banner" />
      <!-- 主要内容部分 -->
      <div class="inner">
        <div v-for="(item, index) in contentList" :key="index">
          <!-- Editor's Picks -->
          <div v-if="item.style === 11 || item.style === 14">
            <div class="common-title editorPick">
              <h2>{{ item.label }}</h2>
              <div
                v-if="item.can_more && item.can_refresh"
                @click="jumpAccordingAction(item)"
              >
                {{$t('msg.more')}}
                <van-icon name="arrow" />
              </div>
            </div>
            <ContentBox
              :list="item.list"
              :more="item.can_more"
              :refresh="item.can_refresh"
              @jumpAccordingAction="jumpAccordingAction(item)"
              @refresh="refresh(item.recommend_id, index)"
            />
          </div>
          <!-- Ranking -->
          <div v-if="item.style === 12">
            <div class="common-title Ranking">
              <h2>{{ item.label }}</h2>
            </div>
            <div class="ranking">
              <ul>
                <li
                  v-for="(items, indexs) in item.list"
                  :key="items.id"
                  @click="jump(items.book_id)"
                >
                  <img :src="items.cover" :alt="items.name" class="rank-pic" />
                  <div class="rank-right">
                    <div class="rank-right-top">
                      <p>
                        {{ items.name }}
                      </p>
                      <div v-if="indexs === 0" class="sortImg">
                        <img src="~img/discover/top1.png" alt="" />
                      </div>
                      <div v-if="indexs === 1" class="sortImg">
                        <img src="~img/discover/top2.png" alt="" />
                      </div>
                      <div v-if="indexs === 2" class="sortImg">
                        <img src="~img/discover/top3.png" alt="" />
                      </div>
                    </div>
                    <div class="rank-right-bottom">
                      <div class="clearfix tagbox">
                        <div
                          class="bTag fl"
                          v-for="(itemss, indexss) in items.tag"
                          :key="indexss"
                        >
                          {{ itemss.tab }}
                        </div>
                      </div>
                      <div class="eyes">
                        <van-icon name="eye-o" />
                        <span>{{ items.total_views }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div
                class="findBtn"
                @click="
                  $router.push('/ranking'),
                    $cookie.set('recommendId', item.recommend_id, 999)
                "
              >
                {{$t('msg.moreBook')}}
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
          <!-- Weekly Recommendation -->
          <div v-if="item.style === 13">
            <div class="common-title weekly">
              <h2>{{ item.label }}</h2>
            </div>
            <div class="weeklyList">
              <ul>
                <li
                  v-for="(items, indexs) in setStatus(item, index)"
                  :key="indexs"
                  class="weeklyitem"
                  :class="`weeklyitem${index}`"
                  @click="jump(items.book_id)"
                >
                  <img :src="items.cover" :alt="items.name" class="rank-pic" />
                  <div class="rank-right">
                    <h3 class="line2">{{ items.name }}</h3>
                    <p class="info line2">
                      {{ items.description }}
                    </p>
                    <div class="tagsbox">
                      <div
                        class="tags"
                        v-for="(itemss, indexss) in items.tag"
                        :key="indexss"
                      >
                        {{ itemss.tab }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="minBtn" @click="changWeeklyStatus(index)">
                <img :class="`pic${index}`" src="~/img/discover/up.png" alt="" />
                <img
                  :class="`pic${index}`"
                  src="~/img/discover/down.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <!-- Top Romance -->
          <!-- <div v-if="item.style === 11">
            <div class="common-title editorPick">
              <h2>Top Romance</h2>
            </div>
            <ContentBox :text="'See All'" :icon="'arrow'" />
          </div> -->
          <!-- Popular Tags -->
          <div v-if="item.style === 15">
            <div class="common-title editorPick">
              <h2>{{ item.label }}</h2>
            </div>
            <div class="popular">
              <div class="popularTag">
                <div
                  v-for="(items, indexs) in item.head"
                  :key="indexs"
                  class="tags"
                  :class="[`tags${index}`, indexs === 0 ? 'tagActive' : '']"
                  @click="tagsClick(item, items, index, indexs)"
                >
                  {{ items.title }}
                </div>
              </div>
              <ContentBox
                @jumpAccordingAction="jumpAccordingAction(item)"
                :list="item.list"
                :eyes="true"
                :more="item.can_more"
                :refresh="item.can_refresh"
              />
            </div>
          </div>
          <!-- You may also like -->
          <div class="like" v-if="item.style === 16">
            <div class="common-title editorPick">
              <h2>{{ item.label }}</h2>
            </div>
            <List
              style="margin-top: 0.75rem"
              :list="item.list"
              :homePageUse="true"
            />
            <div class="more" @click="jumpAccordingAction(item)">
              Find more stories
            </div>
          </div>
        </div>
      </div>
    </div>
    <Search :closepoup.sync="showSearch" :show="showSearch" />
  </div>
</div>
</template>
<script>
import Swiper from "@/components/Swiper";
import ContentBox from "@/components/ContentBox/index.vue";
import AddDesktop from "@/components/AddDesktop";
import List from "@/components/List";
import Search from "@/components/Search";

import { bookIndex, refreshRecommend, tagBooks } from "@/http/api.js";
export default {
  components: { Swiper, ContentBox, AddDesktop, List, Search },
  data() {
    return {
      likeList: [],
      loading: false,
      finished: false,
      banner: [],
      showSearch: false,
      contentList: [],
      skeleton:false
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
  mounted() {
    this.getBookIndex();
    this.setStatus;
    // 设置默认的tag_id为空
    // this.$cookie.set('tagId',null,999)
  },
  methods: {
    // 设置默认值
    setStatus(item, index) {
      this.contentList[index].push = { isScale: false };
      this.$nextTick(() => {
        this.changWeeklyStatus(index);
      });
      return item.list;
    },
    // 下拉的点击收起和展开事件 折叠显示三个
    changWeeklyStatus(i) {
      this.contentList[i].isScale = !this.contentList[i].isScale;
      const arr = document.getElementsByClassName(`weeklyitem${i}`);
      const picArr = document.getElementsByClassName(`pic${i}`);
      Array.from(arr).map((element, index) => {
        if (this.contentList[i].isScale) {
          if (index > 2) {
            arr[index].style.display = "none";
          }
        } else {
          arr[index].style.display = "block";
        }
      });
      if (this.contentList[i].isScale) {
        picArr[0].style.display = "none";
        picArr[1].style.display = "block";
      } else {
        picArr[1].style.display = "none";
        picArr[0].style.display = "block";
      }
    },
    // 获取书城首页
    getBookIndex() {
      this.skeleton = true
      bookIndex(JSON.parse(this.$cookie.get("requireParams"))).then((res) => {
        if (res.data.banner.length == 1) { // 如果是1张banner图，设置成两张，组成轮播效果
          this.banner = [res.data.banner[0], res.data.banner[0]]
        } else {
          this.banner = res.data.banner;
        }
       
        this.contentList = res.data.recommends;
        this.skeleton = false
      });
    },
    // 点击跳转
    jump(id) {
      const bookParams = {
        book_id: id,
        chapter_id: null,
      };
      this.$cookie.set("bookParams", JSON.stringify(bookParams), 1);
      // 点击跳转页面
      this.$router.push({ path: "/detail", query: { book_id: id } });
    },
    // 点击刷新页面
    refresh(id, index) {
      refreshRecommend({ recommend_id: id }).then((res) => {
        this.contentList[index].list = res.data;
        console.log(this.contentList, index);
        console.log(res.data);
      });
    },
    // 根据action点击跳转到不同的页面
    jumpAccordingAction(item) {
      this.$cookie.set("recommendId", item.recommend_id, 999);
      if (item.action === 1) {
        this.$router.push("/listPage");
      } else if (item.action === 2) {
        this.$router.push("/genre");
      } else if (item.action === 3) {
        this.$router.push("/tagsPage");
      }
    },
    // 跳转到分类页面
    jupmToGenre() {
      this.$router.push("/genre");
    },
    // tags标签页的点击刷新局部数据
    tagsClick(item, items, index, indexs) {
      tagBooks(
        Object.assign(
          { tag_id: items.tag_id },
          JSON.parse(this.$cookie.get("requireParams"))
        )
      ).then((res) => {
        this.contentList[index].list = res.data.list;
      });
      this.$cookie.set("tagId", items.tag_id, 999);
      let tagArr = document.getElementsByClassName(`tags${index}`);
      for (let i = 0; i < tagArr.length; i++) {
        tagArr[i].classList.remove("tagActive");
        tagArr[indexs].classList.add("tagActive");
      }
    },
  },
};
</script>
<style lang="scss" scoped>

  // 头部区域
  .header {
    width: 100vw;
    height: 2.5rem;
    padding: 0 0.9375rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafbff;
    .logo {
      // width: 6.34375rem;
      height: 1.9375rem;
    }
    .header-right {
      display: flex;
      .header-shadow {
        margin-left: 0.9375rem;
        width: 1.9375rem;
        height: 1.9375rem;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0.0625rem 0.625rem #a18afb14;
        /deep/ .van-icon-search {
          font-size: 1.125rem;
          color: #9a8cff;
        }
        img {
          width: 1.09375rem;
          height: 1.09375rem;
        }
      }
      .search {
        img {
          width: 1.8rem;
          height: 1.8rem;
        }
      }
    }
  }
.all {
  width: 100vw;
  height: 100%;
  // height: calc(100vh - 0.98rem);
  // overflow-y: auto;
  .inner {
    width: 100%;
    padding: 0 0.9375rem;
    box-sizing: border-box;
    padding-bottom: 5.8rem;
  }
  .common-title {
    display: flex;
    align-items: center;
    width: 97%;
    height: 1.5625rem;
    justify-content: space-between;
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
      padding-left: 0.9375rem;
    }
    div {
      display: flex;
      align-items: center;
      color: #9a8cff;
      font-size: 0.8125rem;
    }
  }
  // Editor's Picks
  .editorPick {
    margin-top: 3.125rem;
  }

  // Ranking
  .Ranking {
    box-sizing: border-box;
    margin-top: 3.75rem;
  }
  .ranking {
    position: relative;
    margin-top: 0.75rem;
    width: 21.5625rem;
    ul {
      width: 100%;
      background: #fff;
      box-shadow: 0 0.3125rem 0.9375rem #a48dff14;
      opacity: 1;
      border-radius: 0 0 0.25rem 0.25rem;
      padding-bottom: 1.875rem;
      li {
        width: 100%;
        padding: 0.625rem 0.9375rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        height: 7.71875rem;
        cursor: pointer;
        color: inherit;
        img {
          width: 4.84375rem;
          height: 100%;
          border-radius: 0.25rem;
          margin-right: 0.75rem;
        }
        .rank-right {
          height: 100%;
          display: flex;
          flex-direction: column;
          flex: 1;
          &-top {
            height: 0;
            flex: 1;
            display: flex;
            justify-content: space-between;
            p {
              width: 11.875rem;
              font-size: 1.125rem;
              color: #333;
              line-height: 1.40625rem;
              height: 2.8125rem;
              text-align: left;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            i {
              font-size: 1.875rem;
              color: #ff4e6e;
            }
          }
          &-bottom {
            height: 1.09375rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0.625rem;
            .bTag {
              width: -webkit-fit-content;
              width: -moz-fit-content;
              width: fit-content;
              padding: 0 0.625rem;
              height: 1.03125rem;
              border: 0.03125rem solid #a79bff;
              opacity: 1;
              border-radius: 0.8125rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.6875rem;
              color: #9a8cff;
            }
            .eyes {
              display: flex;
              align-items: center;
              font-size: 0.75rem;
              color: #c8c8d6;
            }
          }
        }
      }
    }
    .findBtn {
      position: absolute;
      bottom: -0.96875rem;
      left: 6.1875rem;
      width: 9.25rem;
      height: 1.9375rem;
      background: #fff;
      box-shadow: 0 0.3125rem 0.9375rem #f3edff;
      opacity: 1;
      border-radius: 0.96875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9f88ff;
      font-size: 0.875rem;
    }
  }
  // Weekly Recommendation
  .weekly {
    margin-top: 3.75rem;
  }
  .weeklyList {
    background: #a577ff;
    background-image: url(~img/discover/special-recommend-bg.png);
    background-size: 100%;
    padding: 0.9375rem 0.9375rem 2.3125rem;
    margin-top: 0.75rem;
    position: relative;
    border-radius: 0.3rem;
    ul {
      li {
        position: relative;
        width: 19.6875rem;
        height: 7.9375rem;
        background: #fff;
        box-shadow: 0 0.3125rem 0.9375rem #a48dff14;
        border-radius: 0.25rem;
        margin-top: 2.1875rem;
        display: block;
        img {
          width: 5.9375rem;
          height: 7.90625rem;
          border-radius: 0.25rem;
          position: absolute;
          top: -0.71875rem;
          left: 0.71875rem;
        }
        .rank-right {
          margin-left: 7.34375rem;
          padding-top: 0.425rem;
          width: 11.875rem;
          h3 {
            height: 2.5rem;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.25rem;
            color: #2b2a33;
            text-align: left;
          }
          .info {
            height: 2.1875rem;
            font-size: 0.75rem;
            line-height: 1.09375rem;
            color: #8a8a99;
            margin-top: 0.3125rem;
          }
          .tagsbox {
            height: 2.125rem;
            overflow: hidden;
          }
          .tags {
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            padding: 0 0.625rem;
            height: 1.125rem;
            border: 0.03125rem solid #9b8cff;
            border-radius: 0.5625rem;
            line-height: 1.125rem;
            text-align: center;
            font-size: 0.75rem;
            color: #9b8cff;
            margin-top: 0.625rem;
            float: left;
            margin-right: 0.4rem;
          }
        }
      }
    }
    .minBtn {
      width: 3.3125rem;
      height: 1.9375rem;
      background: #fff;
      box-shadow: 0 0.125rem 0.5rem #a577ff66;
      border-radius: 0.96875rem;
      position: absolute;
      bottom: -0.96875rem;
      left: 9.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 0.6875rem;
        height: 0.78125rem;
      }
    }
  }
  //  Popular Tags
  .popular {
    margin-top: 0.75rem;
    width: 21.5625rem;
    background: #fff;
    box-shadow: 0 0.3125rem 0.9375rem #a48dff14;
    opacity: 1;
    border-radius: 0.25rem;
    // padding-bottom: 1.875rem;
    position: relative;
    .popularTag {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 0.03125rem solid #e7e3ff;
      width: 19.6875rem;
      margin: 0 auto;
      padding-top: 0.9375rem;
      .tags {
        height: 1.625rem;
        border: 0.03125rem solid #9b8cff;
        border-radius: 0.8125rem;
        color: #9b8cff;
        line-height: 1.625rem;
        padding: 0 0.625rem;
        margin: 0 0 0.9375rem 0.625rem;
        box-sizing: border-box;
        font-size: 1rem;
      }
    }
  }
  .more {
    margin: 1.125rem auto 0;
    width: 13.25rem;
    height: 2rem;
    border: 0.03125rem solid #9b8cff;
    opacity: 1;
    border-radius: 1.5625rem;
    line-height: 2rem;
    text-align: center;
    color: #9b8cff;
    font-size: 0.875rem;
    display: block;
  }
  .sortImg {
    width: 2rem;
    height: 2rem;
    img {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .tagActive {
    background: linear-gradient(104deg, #afa3ff, #998afd 28%, #735fff);
    color: #fff !important;
  }
}
</style>
<style lang="scss" scoped>
.skeleton {
  padding-bottom: 4rem;
  .top {
    padding: 0 0.9375rem;
    display: flex;
    justify-content: space-between;
    padding-top: 0.2rem;
    .logo {
      height: 1.9375rem;
      width: 6.93rem;
    }
    .right {
      width: 4.75rem;
      height: 1.9375rem;
      display: flex;
      justify-content: space-between;
      p {
        width: 1.9375rem;
        height: 1.9375rem;
        border-radius: 50%;
      }
    }
  }
  .swiper {
    height: 9.125rem;
    margin: 1.5625rem 0;
    width: 100%;
    justify-content: space-between;
    display: flex;
    align-items: center;
    .left,
    .right{
      height: 8.1875rem;
      width: 7%;
    }
    .middle{
      height: 9.125rem;
      width: 78%;
    }
    .left{
      border-radius: 0 .3rem .3rem;
    }
    .right{
      border-radius: .3rem 0 0 .3rem;
    }
  }
  .contents {
    padding: 0 0.9375rem;
    .title {
      display: flex;
      justify-content: space-between;
      .left {
        width: 40%;
        height: 1.5rem;
      }
      .right {
        width: 20%;
        height: 1.5rem;
      }
    }
    .contentbox {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 1.3rem;
      border-radius: 0.25rem;
      position: relative;
      margin-top: 0.75rem;
      background: #f9f9f9;
      .item {
        width: 5.9375rem;
        float: left;
        margin: 0.9375rem 0 0 0.9375rem;
        .img {
          width: 5.9375rem;
          height: 7.90625rem;
          border-radius: 0.28rem;
        }
        .text {
          height: 2.5rem;
          margin-top: 0.2rem;
        }
      }
      .btn {
        position: absolute;
        bottom: -0.96875rem;
        left: 7.15625rem;
        width: 6.28125rem;
        height: 1.9375rem;
        border-radius: 0.96875rem;
        background: #f2f3f5 !important;
      }
    }
  }
}
</style>
