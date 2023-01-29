<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-11 22:41:11
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-18 00:38:40
-->
<!--  -->
<template>
  <div class="">
    <van-popup v-model="showPoup" round position="top"  >
      <div class="searchBox">
        <div class="top">
          <img src="~img/common/name.png" alt="" />
        </div>
        <div class="inp">
          <form @submit.prevent="formSubmit" action="javascript:return true">
            <van-field
               v-model="value1"
              :placeholder="$t('msg.search')"
              class="inner"
              :clearable="true"
              @keyup.13="handleKeyUp"
              >
              <div slot="left-icon" class="searchIcon">
                <img src="~img/common/search-t.png" alt="" />
              </div>
            </van-field>
          </form>
        </div>
        <div class="tags">
          <h3>{{$t('msg.hotWord')}}</h3>
          <ul class="hotWordsBox">
            <li v-for="(item, index) in words" :key="index" @click="hotwordsClick(item)">{{ item }}</li>
          </ul>
        </div>
        <div class="upImg" @click="$emit('update:closepoup', false)">
          <img src="~/img/discover/up.png" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { hotWord,search } from "@/http/api";
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      value1: "",
      words: [],
    };
  },
  computed: {
      showPoup: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:closepoup', value)
      }
    },
  },
  watch: {},
  methods: {
    getHotWords() {
      hotWord(JSON.parse(this.$cookie.get('requireParams'))).then((res) => {
        this.words = res.data;
      });
    },
    formSubmit(){
        console.log(222);
    },
    // 点击回车事件
    handleKeyUp(){
        // 携带参数跳转到搜索页面
       if (this.value1!=='') {
          this.$router.push({ path:'/search', query:{ keyword:this.value1 } })
       }
      
    },
    hotwordsClick(item){
      this.$router.push({ path:'/search', query:{ keyword:item } })
    }
    
  },
  created() {},
  mounted() {
    this.getHotWords();
  },
};
</script>
<style lang="scss" scoped>
/deep/ .van-field__control {
  height: 1.6rem;
}
.searchBox {
  height: 100%;
  flex: 1;
  background: #fafbff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .top {
    margin-top: 4.375rem;
    width: 7.5625rem;
    height: 2.34375rem;
    img {
      width: 100%;
    }
  }
  .inp {
    width: 21.5625rem;
    margin-top: 2.4375rem;
    height: 3.125rem;
    .inner {
      height: 100%;
      background: #fff;
      box-shadow: 0 0.0625rem 0.625rem #a38cff14;
      border: 0.03125rem solid #f2f0ff;
      border-radius: 1.5625rem;
      font-size: 1rem;
      line-height: 1;
      // padding-left: 2.8125rem;
      img{
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
  .tags {
    width: 21.5625rem;
    margin-top: 2.5rem;
    h3 {
      font-size: 1.125rem;
      line-height: 1.25rem;
      color: #333;
      text-align: left;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      max-height: 7.8495rem;
      min-height: 3.93rem ;
      overflow: hidden;
      margin-bottom: 3rem;
      li {
        padding: 0 1rem;
        height: 1.625rem;
        line-height: 1.625rem;
        box-sizing: border-box;
        border: 0.03125rem solid #9b8cff;
        border-radius: 0.8125rem;
        font-size: 0.875rem;
        color: #9b8cff;
        margin: 0.9375rem .3rem 0 0;
      }
      li:nth-child(-n+3) {
         background: linear-gradient(
104deg, #afa3ff, #998afd 28%, #735fff);
        color: #fff !important;
      }
    }
  }
  .upImg {
    position: absolute;
    bottom: .6rem;
    text-align: center;
    padding: 0.2rem 0.4rem;
    img {
      width: 0.7rem;
      height: 0.9rem;
    }
  }
}
</style>
