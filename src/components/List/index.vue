<template>
  <div>
    <div v-if="!homePageUse"  >
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
                <!-- <div
                  class="tag"
                  v-for="(items, indexs) in item.tag"
                  :key="indexs"
                >
                  {{ items.tab }}
                </div> -->
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
    <!-- 这个主要是首页用 因为首页的这个不需要下拉加载 -->
    <div class="homePageUse" v-if="homePageUse">
      <van-list>
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          @click="jump(item.book_id)"
          :class="index === list.length-1?'borderNone':''"
        >
          <div class="mList">
            <img :src="item.cover" :alt="item.anme" />
            <div class="right">
              <div class="top">
                <p class="toptitle">{{ item.name }}</p>
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
                  <van-icon name="eye-o" />{{ item.total_views }}
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
export default {
  components: {},
  props: {
    list: {
      type: [Array, Object],
      default: null,
    },
    homePageUse: {
      type: Boolean,
      default: false,
    },
    getList: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      cat_id: null,
      error: false,
      data: [],
      page: {
        page_num: 1,
        page_size: 10,
      },
      skeleton:false
    };
  },
  computed: {},
  mounted() {

    if (!this.homePageUse) {
      this.skeleton = true
      this.getListData();
    }
  },
  methods: {
    onLoad() {
      this.page.page_num += 1;
      this.cat_id = Number(this.$cookie.get("catId"));
      this.getList(Object.assign(JSON.parse(this.$cookie.get('requireParams')), this.page, { cat_id: this.cat_id }))
        .then((res) => {
          // 数据全部加载完成
          if (res.data.list.length < 10) {
            this.finished = true;
          }
          res.data.list.map((e) => {
            this.data.list.push(e);
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
      this.page.page_num = 1;
      this.cat_id = Number(this.$cookie.get("catId"));
      this.getList(Object.assign(JSON.parse(this.$cookie.get('requireParams')), this.page, { cat_id: this.cat_id })).then(
        (res) => {
          this.data = res.data;
          this.page.page_num = res.data.current_page;
          this.$emit('skeleton',false)
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
.borderNone::after{
  border: unset !important;
}
.van-cell {
  padding: 0.2rem 0.925rem;
}
.mList {
  width: 100%;
  padding: .4rem 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 8.21875rem;
  img {
    width: 5.5640625rem;
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
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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
