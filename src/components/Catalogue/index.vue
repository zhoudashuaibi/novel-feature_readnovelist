<template>
  <div class="">
    <van-popup
      v-model="showPoup"
      get-container="body"
      :style="{
        height: '100%',
        width: '78%',
        background: ' #f1f1f0',
        borderRadius: '0 1.25rem 1.25rem 0',
      }"
      position="left"
      :class="blackTheme ? 'black' : ''"
      @close="$emit('update:closepoup', false)"
      @open="openpoup"
    >
      <div class="main">
        <div v-if="reader">
          <div v-if="dataInfo.book" class="detail">
            <!-- 封面 -->
            <div
              @click="
                $router.push({
                  path: '/detail',
                  query: { book_id: dataInfo.book.book_id },
                })
              "
            >
              <img
                class="img"
                :src="dataInfo.book.cover"
                :alt="dataInfo.book.name"
              />
            </div>
            <!-- 右边的书籍信息 -->
            <div class="detailInfo">
              <div
                class="name"
                @click="
                  $router.push({
                    path: '/detail',
                    query: { book_id: dataInfo.book.book_id },
                  })
                "
              >
                <span>{{ dataInfo.book.name }}</span>
              </div>
              <div class="bot">
                <div class="tags">
                  <!-- <div v-for="(item,index) in dataInfo.book.tag" :key="index" class="tag">{{ item.tab }}</div> -->
                  <div class="clearfix tagbox">
                    <div
                      class="bTag fl tag"
                      v-for="(item, index) in dataInfo.book.tag"
                      :key="index"
                    >
                      {{ item.tab }}
                    </div>
                  </div>
                </div>
                <div @click="changeOrder">
                  <img
                    v-if="order_by === 1"
                    src="~img/detail/jiangxu.png"
                    alt=""
                  />
                  <img v-else src="~img/detail/shengxu.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="contentsTitle">
          <h1>Contents</h1>
          <div @click="changeOrder">
            <img v-if="order_by === 1" src="~img/detail/jiangxu.png" alt="" />
            <img v-else src="~img/detail/shengxu.png" alt="" />
          </div>
        </div>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="No more data"
          loading-text="Loading"
          :immediate-check="false"
          :error.sync="error"
          error-text="Request failed, click reload"
          @load="onLoad"
        >
          <div
            v-for="(item, index) in chapterList"
            :key="index"
            class="itemBox"
            :class="item.is_preview === 1 ? 'lockColor' : 'openColor'"
            @click="jumpToReader(item.chapter_id)"
          >
            <h4
              :class="
                defaultActive(item.chapter_id, chapterList[0].chapter_id)
                  ? 'active'
                  : ''
              "
            >
              {{ item.chapter_title }}
            </h4>
            <i v-if="item.is_preview === 1" class="iconfont icon-password" />
          </div>
        </van-list>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { catalog } from "@/http/api";

export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    reader: {
      type: Boolean,
      default: false,
    },
    activeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dataInfo: {},
      error: false,
      loading: false,
      finished: false,
      chapterList: [],
      order_by: 1,
      blackTheme: true,
    };
  },
  computed: {
    showPoup: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit("update:closepoup", value);
      },
    },
    defaultActive() {
      return function (id, firstChapterId) {
        if (id === this.activeId) {
          return true;
        } else {
          if (this.activeId === 0 && id === firstChapterId) {
            return true;
          }
        }
      };
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getcatalog();
  },
  methods: {
    getcatalog() {
      catalog(
        Object.assign(
          { book_id: this.$route.query.book_id },
          { order_by: this.order_by },
          JSON.parse(this.$cookie.get("requireParams"))
        )
      ).then((res) => {
        this.dataInfo = res.data;
        this.chapterList = res.data.catalog;
        this.finished = false;
        if (res.data.catalog.length < 100) {
          this.finished = true;
        }
      });
    },
    // list中的文章列表
    onLoad() {
      this.finished = false;
      this.loading = true;
      const chapterid =
        this.chapterList[this.chapterList.length - 1].chapter_id;
      const params = JSON.parse(this.$cookie.get("bookParams"));
      params.chapter_id = chapterid;
      catalog(Object.assign(params, { order_by: this.order_by }, JSON.parse(this.$cookie.get("requireParams"))))
        .then((res) => {
          if (res.data.catalog.length < 100) {
            this.finished = true;
          }
          res.data.catalog.map((e) => {
            this.chapterList.push(e);
          });

          // 加载状态结束
          this.loading = false;
          // 数据全部加载完成
          if (res.data.chapter_id === "") {
            this.finished = true;
          }
        })
        .catch(() => {
          this.error = true;
        });
    },
    // 改变顺序
    changeOrder() {
      this.order_by === 1 ? (this.order_by = 2) : (this.order_by = 1);
      this.chapterList = [];
      this.getcatalog();
    },
    jumpToReader(id) {
      const params = JSON.parse(this.$cookie.get("bookParams"));
      params.chapter_id = id;
      if (this.reader) {
        this.$emit("jumpReader", params);
      } else {
        this.$router.push({
          path: "/reader",
          query: { 'book_id': params.book_id, 'chapter_id': id },
        });
      }
      // this.$router.push({
      //   name: "reader",
      //   params,
      // });
      this.$cookie.set("bookParams", JSON.stringify(params), 1);
    },
    // 每次打开poup的时候执行 主要是为了检查主题色
    openpoup() {
      // 如果是在阅读器里面 这时候接受颜色主题的变化 反之 默认为白色
      if (this.$cookie.get("themeColor") === "black" && this.reader) {
        this.blackTheme = true;
      } else {
        this.blackTheme = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 0.9375rem;
  display: flex;
  flex-direction: column;

  .detail {
    display: flex;
    justify-content: space-between;
    border-bottom: 0.03125rem solid #d8d4f4;
    padding-bottom: 1.15625rem;
    .img {
      width: 3.8125rem;
      height: 5.09375rem;
      border-radius: 0.25rem;
      margin-right: 0.5rem;
    }
    .detailInfo {
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        width: 12.5rem;
        height: 2.75rem;
        font-size: 1.125rem;
        font-weight: 700;
        line-height: 1.375rem;
        color: #2b2a33;
        text-align: left;
      }
      .bot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tag {
          height: 1.03125rem;
          border: 0.0625rem solid #a79bff;
          border-radius: 0.8125rem;
          padding: 0 0.625rem;
          line-height: 1.03125rem;
          color: #a79bff;
          font-size: 0.6875rem;
        }
        img {
          width: 1.18rem;
          height: 1.18rem;
        }
      }
    }
  }
}
// 表头为contnet的时候
.contentsTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.03125rem solid #d8d4f4;
  padding-bottom: 1.15625rem;
  h1 {
    font-size: 1.375rem;
    color: #15171a;
  }
  img {
    width: 1.18rem;
    height: 1.18rem;
  }
}
// 下面的列表
.itemBox {
  height: 1.1875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.9375rem;
  h4 {
    width: 15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8125rem;
    text-align: left;
  }
  // 当前选中的时候的颜色
  .active {
    color: #9989ff;
  }
}
.openColor {
  h4,
  i {
    color: #2b2a33;
  }
}
.lockColor {
  h4 {
    color: #716e84;
  }
  i {
    color: #c7c4cc;
  }
}

// 黑色主题
.black {
  background: #333 !important;
  .main {
    background: #333;
    .name {
      color: #fff !important;
    }
    .tag {
      color: #fff !important;
      border-color: #fff !important;
    }
    .bto {
      border-color: #d8d4f4;
    }
    .lockColor {
      h4 {
        color: grey;
      }
      i {
        color: #c7c4cc;
      }
    }
    .openColor {
      h4 {
        color: #b3b3b3;
      }
    }
    // 当前选中的时候的颜色
    .active {
      color: #e6e6e6 !important;
    }
  }
}
</style>
