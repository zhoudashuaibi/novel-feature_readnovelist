<template>
  <div
    class="box"
    :style="eyes?'padding-bottom: 1.875rem':''"
  >
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="jump(item.book_id)">
        <img :src="item.cover" :alt="item.name">
        <p>{{ item.name }}</p>
        <div v-if="eyes" class="eyes">
          <van-icon name="eye-o" />
          <span> {{item.total_views}} </span>
        </div>
      </li>
    </ul>
    <!-- 只有刷新的时候显示这个 -->
    <div class="main-next" @click="$emit('refresh')" v-show="refresh && more">
      {{$t('read.tryOthers')}}
      <van-icon name="replay" />
    </div>
    <!-- 除了刷新之外的显示see all -->
    <div class="main-next" v-show="more && ! refresh"  @click="$emit('jumpAccordingAction')">
      {{$t('read.seeAll')}}
      <van-icon name="arrow" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Wrap',
  components: {},
  props: {
    list: {
      type: Array,
      default: null
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    eyes: {
      type: Boolean,
      default: false
    },
    more: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {}
  },

  computed: {},

  mounted() {},

  methods: {
    // 点击跳转
    jump(id) {
       const bookParams = {
        book_id: id, chapter_id: null
      }
      this.$cookie.set('bookParams', JSON.stringify(bookParams), 1)
      // 点击跳转页面
      this.$router.push({path: '/detail', query: {'book_id': id}})
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  margin-top: 0.75rem;
  width: 100%;
  // height: 25.5rem;
  background: #fff;
  box-shadow: 0 0.3125rem 0.9375rem #a48dff14;
  opacity: 1;
  border-radius: 0.25rem;
  position: relative;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 1.3rem;
    li {
      width: 5.9375rem;
      float: left;
      margin: 0.9375rem 0 0 0.9375rem;
      img {
        width: 5.9375rem;
        height: 7.90625rem;
        border-radius: 0.28rem;
      }
      p {
        height: 2.5rem;
        font-size: 0.8125rem;
        font-weight: 700;
        line-height: 1.25rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: left;
      }
    }
  }
  .main-next {
    position: absolute;
    bottom: -0.96875rem;
    left: 7.15625rem;
    width: 6.28125rem;
    height: 1.9375rem;
    background: #fff;
    box-shadow: 0 0.3125rem 0.9375rem #f3edff;
    border-radius: 0.96875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9f88ff;
    font-size: 0.875rem;
  }
  .eyes{
    display: flex;
    align-items: center;
    font-size: .75rem;
    color: #c8c8d6;
      i{
        font-size: .8125rem;
        margin-right: 0.15625rem;
      }
  }
}
</style>
