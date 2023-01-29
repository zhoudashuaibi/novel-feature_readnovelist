<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-12 11:53:28
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 16:13:35
-->
<!--  -->
<template>
  <div class="mh" style="overflow-y: scroll">
    <div class="contentbox">
      <div class="searchBox">
        <div class="goback" @click="$router.go(-1)">
          <i class="icon-fanhui iconfont" />
        </div>
        <div class="right">
          <form @submit.prevent="formSubmit" action="javascript:return true">
            <van-field
              v-model="value1"
              placeholder="Search"
              class="inner"
              :clearable="true"
              @keyup.13="handleKeyUp"
            >
              <div slot="left-icon" class="searchIcon">
                <img src="~img/common/searchTransparent.png" alt="" />
              </div>
            </van-field>
          </form>
        </div>
      </div>
      <!-- 骨架屏 -->
      <div v-if="skeleton">
        <skeleton></skeleton>
      </div>
      <div v-else>
        <!-- 没有数据的时候的显示 -->
        <div v-if="empty" class="bottm">
          <div class="emptyImg">
            <img src="~img/common/no-data.png" alt="" />
            <p>Oops, no results found.Why not try others?</p>
          </div>
          <img class="searchBot" src="~img/common/searchBot.png" alt="" />
        </div>
        <!-- 有数据的时候的显示 -->
        <div class="haveData">
          <h1 v-if="empty">{{ data.guess_like.label }}</h1>
          <van-list style="background: #f5f5f5">
            <van-cell
              v-for="(item, index) in dataBox"
              :key="index"
              @click="jumpToDetail(item.book_id)"
            >
              <div class="mList">
                <img :src="item.cover" :alt="item.title" />
                <div class="right">
                  <div class="top">
                    <p class="toptitle">
                      {{ item.name }}
                    </p>
                    <p class="info line2">{{ item.description }}</p>
                  </div>
                  <div class="bot">
                    <!-- <div class="tag" v-for="(items,index) in item.tag" :key="index" v-show="item.tag.length > 0"> {{items.tab}} </div> -->
                    <div class="clearfix tagbox">
                      <div
                        class="bTag fl tag"
                        v-for="(items, indexs) in item.tag"
                        :key="indexs"
                        v-show="item.tag.length > 0"
                      >
                        {{ items.tab }}
                      </div>
                    </div>
                    <div class="view">
                      <van-icon name="eye-o" />{{ item.total_views }}
                    </div>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { search } from "@/http/api";
import { search as searchFb } from "@/utils/fbq";
import skeleton from "@/components/skeleton";

export default {
  components: { skeleton },
  data() {
    return {
      keyword: null,
      value1: "",
      empty: false,
      data: null,
      dataBox: [],
      skeleton:false
    };
  },
  computed: {},
  watch: {},
  methods: {
    getSearchdata(keyword) {
      this.skeleton = true
      search(keyword).then((res) => {
        this.empty = res.data.search_result.length > 0 ? false : true;
        this.data = res.data;
        this.dataBox =
          res.data.search_result.length > 0
            ? res.data.search_result
            : res.data.guess_like.list;
        searchFb(keyword);
        this.skeleton = false
      });
    },
    // 点击回车事件
    handleKeyUp() {
      if (this.value1 !== "") {
        this.getSearchdata(
          Object.assign(
            { keyword: this.value1 },
            JSON.parse(this.$cookie.get("requireParams"))
          )
        );
      }
    },
    jumpToDetail(id) {
      const params = {
        book_id: id,
        chapter_id: null,
      };
      this.$cookie.set("bookParams", JSON.stringify(params), 1);
      this.$router.push({ path: "/detail", query: { book_id: id } });
    },
  },
  created() {},
  mounted() {
    this.keyword = this.$route.query.keyword;
    this.value1 = this.$route.query.keyword;
    this.getSearchdata(
      Object.assign(
        { keyword: this.value1 },
        JSON.parse(this.$cookie.get("requireParams"))
      )
    );
    console.log(this.dataBox);
  },
};
</script>
<style lang="scss" scoped>
.searchBox {
  display: flex;
  padding: 0.625rem 0.9375rem 0.625rem 0;
  align-items: center;
  justify-content: space-between;
  .goback {
    width: 2.4375rem;
    padding-left: 0.8375rem;
    height: 1.75rem;
    i {
      line-height: 1.75rem;
      font-size: 0.9375rem;
      color: #9a8cff;
    }
  }
  .right {
    width: 0;
    flex: 1;
    vertical-align: middle;
    .inner {
      width: 100%;
      height: 1.75rem;
      background: #f5f5ff;
      border: 0.0312rem solid #f2f0ff;
      border-radius: 1.5625rem;
      font-size: 0.875rem;
      padding: 0 1rem 0 0.7rem;
      color: #666;
      display: flex;
      align-items: center;
    }
    .searchIcon {
      width: 0.9rem;
      height: 0.9rem;
      margin-right: 0.3rem;
      margin-top: -0.3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  /deep/.van-field__control {
    color: #666;
  }
}
.bottm {
  .emptyImg {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.875rem 0 0.78125rem;
    img {
      width: 11.25rem;
      height: 9.28125rem;
    }
    p {
      width: 14.0625rem;
      font-size: 1rem;
      line-height: 1.46875rem;
      color: #9f9fb1;
      text-align: center;
      margin-top: 0.75rem;
    }
  }
  .searchBot {
    width: 23.4375rem;
    height: 2.03125rem;
  }
}
</style>
<style lang="scss" scoped>
.haveData {
  h1 {
    text-align: left;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    padding-left: 16px;
  }
}
.mList {
  width: 100%;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 8.21875rem;
  img {
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
    .top {
      height: 0;
      flex: 1;
      width: 14.0625rem;
      .toptitle {
        font-size: 1.125rem;
        color: #333;
        line-height: 1.5625rem;
        height: 3.125rem;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
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
.van-cell::after {
  border: none !important;
}
</style>
