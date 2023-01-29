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
      <van-sticky>
        <div class="head">
          <h2 class="nav-bar">
            {{$t('msg.allGenres')}}
            <div class="back-icon" @click="$router.go(-1)">
              <van-icon name="arrow-left" />
            </div>
          </h2>

          <div v-if="!skeleton">
            <van-tabs
            @click="titleClick"
            v-model="activeTab"
            :swipe-threshold="3"
          >
            <van-tab
              v-for="(item, i) in data"
              :title="item.cat_name"
              :key="i"
            ></van-tab>
          </van-tabs>
          </div>

          <div class="more-area">
            <div class="genre-more" @click="showPopup">
              <van-icon name="arrow-down" />
            </div>
          </div>

          <!-- 下拉分类的图片 -->
          <van-popup v-model="show" position="top">
            <div class="pop-content">
              <div class="pop-main">
                <div class="pop-back">
                  All Genres
                  <div class="back-icon" @click="$router.go(-1)">
                    <van-icon name="arrow-left" />
                  </div>
                </div>
                <div class="pop-image">
                  <a
                    href="#"
                    v-for="(item, i) in data"
                    :key="i"
                    @click="picClick(item, i)"
                  >
                    <van-image
                      class="img"
                      fit="cover"
                      width="6.75rem"
                      height="3.25rem"
                      :src="item.bg_image"
                      :alt="item.cat_name"
                    />
                    <div
                      class="bgcolor"
                      :style="{ backgroundColor: item.bg_color }"
                    >
                      <span class="cat-name">{{ item.cat_name }}</span>
                    </div>
                  </a>
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
      </van-sticky>
    </div>
    <div class=" scroll">
      <List ref="list" :getList="getCategoryBook"  @skeleton="skeleton = false"/>
    </div>
  </div>
</template>

<script>
import List from "@/components/List";
import { getCategory, getCategoryBook } from "@/http/api";
import skeleton from "@/components/skeleton";
export default {
  components: { List, skeleton },

  data() {
    return {
      getCategoryBook,
      activeItem: 0, // 选中分类下标
      show: false,
      data: [],
      activeTab: null,
      skeleton: false,
    };
  },
  mounted() {
    this.category();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    // 获取分类列表的数据
    category() {
      this.skeleton = true;
      getCategory(JSON.parse(this.$cookie.get("requireParams"))).then((res) => {
        this.data = res.data;
      });
    },
    // 标题点击事件
    titleClick(item) {
      this.activeTab = item;
      const id = this.data[item].cat_id;
      this.itemClick(id)
    },
    // 照片点击事件
    picClick(item, i) {
      this.activeTab = i;
      this.show = false;
      const id = item.cat_id;
      this.itemClick(id)
    },
    itemClick(id){
      this.$cookie.set("catId", id, 1);
      this.$refs["list"].getListData();
      this.$refs["list"].loading = false
      this.$refs["list"].finished = false
    }
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
      .pop-image {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0.9375rem;
        a {
          padding-top: 0.4rem;
          position: relative;
        }
        a:nth-child(3n + 2) {
          margin: 0 0.7rem;
        }
        .img {
          /deep/img {
            border-radius: 0.3rem;
          }
        }
        .bgcolor {
          position: absolute;
          z-index: 2000;
          opacity: 0.8;
          width: 6.75rem;
          height: 3.25rem;
          top: 0.4rem;
          border-radius: 0.3rem;
          color: #fff;
          font-size: 1rem;
          line-height: 3.25rem;
          text-align: center;
          .cat-name {
            display: inline-block;
            vertical-align: middle;
            line-height: 1.25rem;
          }
        }
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
