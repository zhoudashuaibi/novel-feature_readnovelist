<template>
  <div class="all scroll">
    <!-- 骨架屏 -->
    <div class="skeleton van-skeleton--animate" v-if="skeleton">
      <van-sticky>
        <van-nav-bar :title="'Title'" left-arrow @click-left="$router.go(-1)" />
      </van-sticky>
      <div class="box" v-for="i in 6" :key="i">
        <p class="left"></p>
        <p class="middle"></p>
        <div class="right">
          <van-skeleton :row="2" />
          <div class="bot">
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div v-else>
      <van-sticky>
      <van-nav-bar :title="title" left-arrow @click-left="$router.go(-1)" />
    </van-sticky>
    <div class="content-list">
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
          v-for="(item, index) in data.list"
          :key="index"
          @click="jump(item.book_id)"
        >
          <div class="item">
            <div class="rank-order">
              <img
                class="topImg"
                v-if="index === 0"
                src="~img/discover/top1.png"
                alt=""
              />
              <img
                class="topImg"
                v-else-if="index === 1"
                src="~img/discover/top2.png"
                alt=""
              />
              <img
                class="topImg"
                v-else-if="index === 2"
                src="~img/discover/top3.png"
                alt=""
              />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <img :src="item.cover" :alt="item.name" class="item-cover" />
            <div class="item-info">
              <div class="item-title line2">{{ item.name }}</div>
              <div class="item-bot">
                <div class="clearfix tagbox">
                  <div
                    class="bTag fl tag item-tag"
                    v-for="(items, indexs) in item.tag"
                    :key="indexs"
                  >
                    {{ items.tab }}
                  </div>
                </div>
                <div class="item-view">
                  <i class="iconfont">&#xe608;</i>{{ item.total_views }}
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
import { recommendList } from "@/http/api";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      data: [],
      page: {
        page_num: 1,
        page_size: 10,
      },
      title: "",
      skeleton: false,
    };
  },
  methods: {
    onLoad() {
      this.page.page_num += 1;
      this.finished = false;
      this.loading = true;
      this.recommend_id = Number(this.$cookie.get("recommendId"));
      recommendList(
        Object.assign(this.page, { recommend_id: this.recommend_id }, JSON.parse(this.$cookie.get("requireParams")))
      )
        .then((res) => {
          // 数据全部加载完成
          if (res.data.list.list < 10) {
            this.finished = true;
          }
          res.data.list.list.map((e) => {
            this.data.list.list.push(e);
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
      this.skeleton = true;
      this.page.page_num = 1;
      this.recommend_id = Number(this.$cookie.get("recommendId"));
      recommendList(
        Object.assign(this.page, { recommend_id: this.recommend_id }, JSON.parse(this.$cookie.get("requireParams")))
      ).then((res) => {
        this.data = res.data.list;
        console.log(res.data);
        this.title = res.data.label;
        this.finished = true;
        this.page.page_num = res.data.current_page + 1;
        this.skeleton = false;
      });
    }, // 点击跳转
    jump(id) {
      const bookParams = {
        book_id: id,
        chapter_id: null,
      };
      this.$cookie.set("bookParams", JSON.stringify(bookParams), 1);
      // 点击跳转页面
      this.$router.push({ path: "/detail", query: { book_id: id } });
    },
  },
  mounted() {
    this.getListData();
  },
};
</script>

<style scoped lang="scss">
.content-list {
  // height: 0;
  flex: 1;
  width: 21.5625rem;
  margin: 0 auto;
  background: #fff;
  padding: 0 0.625rem;
  overflow-y: auto;
  .item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 1.125rem;
    .rank-order {
      width: 1.875rem;
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: center;
      .topImg {
        width: 2rem;
        height: 2rem;
      }
      // img {
      //   width: 4.84375rem;
      //   height: 6.46875rem;
      //   background: transparent;
      //   box-shadow: 0 0.3125rem 0.9375rem #f0f0f0;
      //   border-radius: 0.25rem 0.75rem 0.75rem 0.25rem;
      //   margin: 0 0.625rem 0 0.75rem;
      // }
      span {
        color: #666;
        font-size: 1.5rem;
      }
    }
    .item-cover {
      width: 4.84375rem;
      height: 6.46875rem;
      background: transparent;
      box-shadow: 0 0.3125rem 0.9375rem #f0f0f0;
      border-radius: 0.3rem;
      margin: 0 0.625rem 0 0.75rem;
    }

    .item-info {
      width: 0;
      flex: 1;
      height: 6.46875rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.3125rem 0;
      .item-title {
        width: 100%;
        color: #333;
        line-height: 1.5625rem;
        height: 3.125rem;
        font-size: 1rem;
      }
      .item-bot {
        height: 1.09375rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-tag {
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
        .item-view {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #c8c8d6;
          i {
            font-size: 0.8125rem;
            margin-right: 0.15625rem;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.content-list {
  .van-cell {
    padding: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.skeleton {
  padding: 10px 16px;
  .box {
    display: flex;
    align-items: center;
    margin-top: 1.125rem;
    justify-content: space-between;
    padding: 0 0.625rem;
    .left {
      width: 2rem;
      height: 2rem;
    }
    .middle {
      width: 4.84375rem;
      height: 6.46875rem;
      border-radius: 0.3rem;
      margin: 0 0.625rem 0 0.75rem;
    }
    .right {
      width: 0;
      flex: 1;
      height: 6.46875rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.3125rem 0;

      .bot {
        display: flex;
        justify-content: space-between;
        height: 1.09375rem;
        p {
          width: 2rem;
          height: 1.03125rem;
        }
      }
    }
  }
}
</style>
