<template>
  <div class="scroll">
     <!-- 骨架屏 -->
    <div v-if="skeleton">
      <div class="skeleton van-skeleton--animate">
        <div class="topbox">
          <span class="left" @click-left="$router.go(-1)"
            ><van-icon name="arrow-left"
          /></span>
          <span class="title"></span>
          <div class="tags">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="down"></div>
        </div>
        <skeleton></skeleton>
      </div>
    </div>
    <!-- 内容区域 -->
    <div v-else>
      <div class="head">
      <h2 class="nav-bar">
        All Tags
        <div class="back-icon" @click="$router.go(-1)">
          <van-icon name="arrow-left" />
        </div>
      </h2>
      <van-sticky>
        <van-tabs @click="titleClick" :swipe-threshold="3" v-model="tabActive">
          <van-tab
            v-for="(item, i) in data"
            :title="item.tag_name"
            :key="i"
          ></van-tab>
        </van-tabs>

        <div class="more-area">
          <div class="genre-more" @click="showPopup">
            <van-icon name="arrow-down" />
          </div>
        </div>
      </van-sticky>
      <!-- 下拉分类的图片 -->
      <van-popup v-model="show" position="top">
        <div class="pop-content">
          <div class="pop-main">
            <div class="pop-back">
              All Tags
              <div class="back-icon" @click="$router.go(-1)">
                <van-icon name="arrow-left" />
              </div>
            </div>
            <div class="popularTag">
              <div
                v-for="(items, indexs) in data"
                :key="indexs"
                class="tags"
                :class="[tabActive === indexs ? 'tagActive' : '']"
                @click="picClick(indexs)"
              >
                {{ items.tag_name }}
              </div>
            </div>
          </div>

          <div class="pop-bot">
            <div class="up-icon" @click="show = false">
              <van-icon name="arrow-up" />
            </div>
          </div>
        </div>
      </van-popup>
    </div>

    <div class=" scroll">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="No more data"
        :loading-text="'loading'"
        :immediate-check="false"
        :error.sync="error"
        error-text="Request failed, click reload"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in dataList.list"
          :key="index"
          @click="jump(item.book_id)"
        >
          <div class="mList">
            <img :src="item.cover" :alt="item.name" />
            <div class="right">
              <div class="top">
                <p class="toptitle">
                  {{ item.name }}
                </p>
                <p class="info line2">{{ item.description }}</p>
              </div>
              <div class="bot">
                  <div class="clearfix tagbox">
                  <div
                    class="bTag fl tag"
                    v-for="(items, indexs) in item.tag"
                    :key="indexs"
                  >
                    {{ items.title }}
                  </div>
                </div>
                <div class="view">
                  <van-icon name="eye-o" />
                  {{ item.total_views }}
                </div>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
    </div>
  </div>
</template>

<script>
import List from "@/components/List";
import { tagBooks, tagList } from "@/http/api";
import skeleton from "@/components/skeleton"
export default {
  components: { List,skeleton },

  data() {
    return {
      tagBooks,
      tabActive: null, // 选中分类下标
      show: false,
      data: [],
      loading: false,
      finished: false,
      cat_id: null,
      error: false,
      page: {
        page_num: 1,
        page_size: 10,
      },
      dataList: [],
      skeleton:false
    };
  },
  mounted() {
    this.category();
    this.getListData();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    // 获取分类列表的数据
    category() {
      tagList().then((res) => {
        this.data = res.data;
        res.data.map((e,i) => {
          Number(e.tag_id) === Number(this.$cookie.get("tagId"))?this.tabActive = i:console.log(2);
        })
      });
    },
    // 标题点击事件
    titleClick(item) {
      this.tabActive = item;
      const id = this.data[item].tag_id;
      console.log(id);
      this.$cookie.set("tagId", id, 1);
      this.getListData();
    },
    // 照片点击事件
    picClick(item) {
      this.show = false;
      this.titleClick(item);
    },

    onLoad() {
      this.page.page_num += 1;
      this.cat_id = Number(this.$cookie.get("tagId"));
      tagBooks(Object.assign(this.page, { tag_id: this.cat_id }))
        .then((res) => {
          // 数据全部加载完成
          if (res.data.list.length < 10) {
            this.finished = true;
          }
          res.data.list.map((e) => {
            this.dataList.list.push(e);
          });

          // 加载状态结束
          this.loading = false;
        })
        .catch(() => {
          this.error = true;
        });
    },
    // 获取列表
    getListData() {
      this.skeleton = true
      this.page.page_num = 1;
      this.cat_id = Number(this.$cookie.get("tagId"));
      tagBooks(Object.assign(this.page, { tag_id: this.cat_id }, JSON.parse(this.$cookie.get("requireParams")))).then(
        (res) => {
          this.dataList = res.data;
          this.skeleton = false
        }
      );
    },
    // 点击跳转
    jump(id) {
      const bookParams = {
        book_id: id,
        chapter_id: null,
      };
      this.$cookie.set("bookParams", JSON.stringify(bookParams), 1);
      // 点击跳转页面
      this.$router.push({path: '/detail', query: {'book_id': id}});
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  background: #9b8cff;
  position: relative;
  border-radius: 0 0 1.5rem 1.5rem;

  .nav-bar {
    position: relative;
    height: 3.4375rem;
    padding: 0.9375rem 0;
    line-height: 1.5625rem;
    color: #fff;
    font-size: 1.125rem;
    text-align: center;
    .back-icon {
      padding: 0 0.9375rem;
      height: 3.4375rem;
      line-height: 3.4375rem;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  // 分类
  .genre-list {
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 0.9375rem;
    height: 2.1875rem;
    padding-bottom: 0.625rem;
    overflow-x: auto;
    .genre-item {
      display: inline;
      h3 {
        margin-right: 2.5rem;
        font-size: 0.9375rem;
        color: #fff;
        white-space: nowrap;
      }
    }

    .genre-active {
      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        position: relative;
        .genre-bot {
          width: 0.5rem;
          height: 0.1875rem;
          background: #fff;
          left: 50%;
          position: absolute;
        }
      }
    }
  }
  /deep/ .van-tabs {
    .van-tabs__nav {
      background: #9b8cff;
    }
    .van-tab {
      // tab项
      .van-tab__text {
        font-size: 0.9375rem;
        color: #fff;
      }
    }
    .van-tab--active {
      // 选中状态字段
      .van-tab__text {
        font-size: 1.25rem;
        font-weight: 700;
      }
    }
    .van-tabs__line {
      width: 0.5rem;
      height: 0.1875rem;
      background: #fff;
      bottom: 0.375rem;
    }
  }

  // 更多
  .more-area {
    height: 1.5rem;
    .genre-more {
      width: 1.125rem;
      height: 1.125rem;
      background: #afa3ff;
      border-radius: 50%;
      color: #fff;
      font-size: 0.625rem;
      text-align: center;
      line-height: 1.25rem;
      margin: 0.625rem auto 0;
      position: relative;
      z-index: 10;
    }
  }

  /deep/ .van-popup--top {
    border-radius: 0 0 1.5rem 1.5rem;
  }

  .pop-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .pop-main {
      height: 0;
      flex: 1;
      background: #fff;
      .pop-back {
        position: relative;
        height: 3.4375rem;
        padding: 0.9375rem 0;
        line-height: 1.5625rem;
        color: #333;
        font-size: 1.125rem;
        text-align: center;
        .back-icon {
          padding: 0 0.9375rem;
          height: 3.4375rem;
          line-height: 3.4375rem;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
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
      }
    }
    .tagActive{
    background: linear-gradient(104deg,#afa3ff,#998afd 28%,#735fff);
    color: #fff !important;
  }
    }
    .pop-bot {
      width: 100%;
      height: 2.1rem;
      border-radius: 1rem;
      // background-image: url(~img/discover/bg-pop-bot.png);
      // background-size: 100% 100%;
      margin-top: 1rem;
      .up-icon {
        width: 1.25rem;
        height: 1.25rem;
        background: #afa3ff;
        border-radius: 50%;
        color: #fff;
        font-size: 0.625rem;
        text-align: center;
        line-height: 1.25rem;
        margin: 0.2rem auto;
        position: relative;
        z-index: 10;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.mList {
  width: 100%;
  padding: .4rem 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 8.21875rem;
  img {
    width: 5.56rem;
    // height: 100%;
    border-radius: 0.25rem;
    margin-right: 0.75rem;
  }
  .right {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .top {
      height: 0;
      flex: 1;
      // width: 14.0625rem;
      .toptitle {
        font-size: 1.125rem;
        color: #333;
        line-height: 1.5625rem;
        height: 3.125rem;
      }
      .info {
        font-size: 0.75rem;
        color: #b3b3b3;
        line-height: 1.09375rem;
        margin-top: 0.3125rem;
      }
    }
    .bot {
      height: 1.09375rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tag {
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
      .view {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        color: #c8c8d6;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.skeleton {
  .topbox {
    width: 100%;
    height: 8.3125rem;
    border-radius: 0 0 1.5rem 1.5rem;
    background: #f2f3f5 !important;
    position: relative;
    .left {
      width: 1.5625rem;
      height: 1.5625rem;
      line-height: 1.5625rem;
      position: absolute;
      top: 0.9375rem;
      left: 0.9375rem;
      background: #fff;
      border-radius: 0.3rem;
      i {
        color: #f2f3f5;
      }
    }
    .title {
      height: 1.5625rem;
      width: 5rem;
      background: #fff;
      border-radius: 0.3rem;
      position: absolute;
      top: 0.9375rem;
      left: 50%;
      transform: translateX(-50%);
    }
    .tags {
      width: 100%;
      display: flex;
      justify-content: space-around;
      position: absolute;
      top: 3.7375rem;
      span {
        display: inline-block;
        width: 6.125rem;
        background: #fff;
        border-radius: 0.3rem;
        height: 1.7rem;
      }
    }
    .down {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0.5rem;
    }
  }
}
</style>

