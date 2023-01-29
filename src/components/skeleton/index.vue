<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-20 15:48:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 15:49:41
-->
<!--  -->
<template>
<div class=''>
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
</template>

<script>

export default {
components: {},
props:{
    skeleton:{
        type:Boolean,
        default:false
    }
},
data() {
return {

};
},
computed: {},
watch: {},
methods: {

},
created() {

},
mounted() {

},
}
</script>
<style lang='scss' scoped>
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