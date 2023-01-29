<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-13 21:03:17
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-22 20:31:41
-->
<!--  -->
<template>
  <div class="scroll">
    <!-- 骨架屏 -->
    <div v-if="skeleton">
      <van-sticky>
        <van-nav-bar :title="'More'" left-arrow @click-left="$router.go(-1)" />
      </van-sticky>
      <div class="skeleton van-skeleton--animate">
        <div class="mList" v-for="i in 6" :key="i">
          <p class="img"></p>
          <div class="right">
            <van-skeleton :row="2" />
            <van-skeleton :row="2" />
            <div class="bot">
              <p class="block"></p>
              <p class="block"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div v-else>
      
    <van-sticky>
      <van-nav-bar :title="title" left-arrow @click-left="$router.go(-1)" />
    </van-sticky>
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
        v-for="(item, index) in data"
        :key="index"
        @click="jump(item.book_id)"
      >
        <div class="mList">
          <img :src="item.cover" :alt="item.name" />
          <div class="right">
            <div class="top">
              <p class="toptitle line2">
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
                  {{ items.tab }}
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
      page_num: 1,
      title: "",
      skeleton: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    onLoad() {
      this.page_num += 1;
      this.recommend_id = Number(this.$cookie.get("recommendId"));
      recommendList(Object.assign({
        page_num: this.page_num,
        recommend_id: this.recommend_id,
      }, JSON.parse(this.$cookie.get("requireParams"))))
        .then((res) => {
          res.data.list.list.map((e) => {
            this.data.push(e);
          });
          console.log(res.data.list.list);
          // 数据全部加载完成
          if (res.data.list.list.length < 10) {
            this.finished = true;
          }

          // 加载状态结束
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.error = true;
        });
    },
    // 获取列表
    getListData() {
      this.skeleton = true;
      this.page_num = 1;
      this.recommend_id = Number(this.$cookie.get("recommendId"));
      recommendList(Object.assign({
        page_num: this.page_num,
        recommend_id: this.recommend_id,
      }, JSON.parse(this.$cookie.get("requireParams")))).then((res) => {
        this.data = res.data.list.list;
        this.title = res.data.label;
        this.skeleton = false;
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
  },
  created() {},
  mounted() {
    this.getListData();
  },
};
</script>
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
  padding: 10px 16px;
  overflow: hidden;
  .mList {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 8.21875rem;
    .img {
      width: 4.84375rem;
      height: 100%;
      border-radius: 0.25rem;
      margin-right: 0.75rem;
    }
    .right {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      .bot {
        display: flex;
        justify-content: space-between;
        height: 1.09375rem;
        p {
          width: 3rem;
          border-radius: 0.8125rem;
          height: 1.03125rem;
        }
      }
    }
  }
}
</style>
