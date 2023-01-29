<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-06 17:30:42
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 17:27:14
-->
<template>
  <div>
    <van-overlay :show="loading" @click="show = false">
      <div class="wrapper" @click.stop>
        <img src="@/assets/img/loading.gif" alt="loading" width="200px">
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  components: { },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {
    // this.Loading = this.loading
  },
  mounted() {
    // this.book_id = this.$route.params
  }

}
</script>
<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }
</style>
