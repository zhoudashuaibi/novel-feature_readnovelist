<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-15 19:28:55
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 16:57:15
-->
<!--  -->
<template>
  <div class="scroll">
    <van-sticky>
      <van-nav-bar
        :title="$t('detail.comment') + ` (${total})`"
        left-arrow
        @click-left="$router.go(-1)"
      />
    </van-sticky>
    <van-skeleton v-for="i in 7 " :key="i" v-show="skeleton" avatar :row-width="['100%','100%','20%']" :row="3" style="    margin-bottom: 1rem;" />
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
      <div class="inner">
        <div class="commentBox" v-for="(item, index) in dataList" :key="index">
          <div class="commentleft">
            <img :src="item.avatar" @error="defImg" />
          </div>
          <div class="commentright">
            <h3>{{ item.nickname }}</h3>
            <p>{{ item.content }}</p>
            <div class="time">
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <div class="inpComment">
      <!-- 输入任意文本 -->
      <form @submit.prevent="formSubmit" action="javascript:return true">
      <van-field v-model.trim="text" class="inp" :clearable="true" @keyup.13="comment"  :placeholder="$t('detail.write')" @click="textClick" ref="commentText" :readonly="textReadOnly" />
      </form>
    </div>
    <Login :showLogin="showLogin" @closePopup="closePopup"/>
  </div>
</template>

<script>
import { commentList, addComment, userCheck } from "@/http/api";
import { Toast } from 'vant';
import Login from '@/components/User/login'
import { writeComment } from '@/utils/fbq';

export default {
  components: { Login },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page_num: 1,
      dataList: [],
      error: false,
      title: "",
      total: "",
      text:'',
      defaultImg: require("img/discover/default-avatar.png"),
      showLogin: false,
      textReadOnly: true,
      skeleton:false
    };
  },
  computed: {},
  watch: {},
  methods: {
    onLoad() {
      const book_id = this.$route.query.book_id;
      
      this.page_num += 1;
      commentList(Object.assign({ page_num: this.page_num, book_id: book_id }, JSON.parse(this.$cookie.get("requireParams")))).then((res) => {
        // this.dataList = res.data.list;
        res.data.list.map((e) => {
          this.dataList.push(e);
        });
        // 加载状态结束
        this.loading = false;
        if (res.data.list.length < 10) {
          this.finished = true;
        }
      });
    },
    getData() {
      this.skeleton = true
      const book_id = this.$route.query.book_id;
      commentList(Object.assign({ page_num: this.page_num, book_id: book_id }, JSON.parse(this.$cookie.get("requireParams")))).then((res) => {
        this.dataList = res.data.list;
        this.total = res.data.total_count;
        this.skeleton = false
      });
    },
    // 书籍进行评论
    comment() {
      if (this.text == '') { // 内容不能为空
        Toast('Please write something')
        return
      }

      const book_id = this.$route.query.book_id;
      addComment(Object.assign(JSON.parse(this.$cookie.get("requireParams")), {content:this.text, book_id: book_id})).then(res => {
        this.text = ''
        this.getData()
        this.textReadOnly = true
        writeComment(book_id)

        if (res.code != 0) {
          Toast(res.msg)
        }
      })
    },
    formSubmit(){
        console.log(222);
    },
    textClick() { // 发起评论时，检测用户是否登录
      userCheck(JSON.parse(this.$cookie.get("requireParams"))).then(res => {
        if (res.code != 0) { // 未登录需要提示登录
          this.showLogin = true
        } else {
          this.textReadOnly = false
        }
      })
    },
    defImg(){
      let img = event.srcElement;
      img.src = this.defaultImg;
      img.onerror = null; //防止闪图
    },
    closePopup() { // 关闭弹窗
      this.showLogin = false;
    },
  },
  created() {},
  mounted() {
    this.getData();
  },
};
</script>
<style lang="scss" scoped>
.inner {
  padding: 0 0.9375rem;
  padding-bottom: 3.5rem;
}
.commentBox {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
  .commentleft {
    width: 3rem;
    border-radius: 50%;
    height: 2rem;
    img {
      width: 1.9rem;
      height: 1.9rem;
      border-radius: 50%;
      vertical-align: middle;
      display: inline-block;
    }
  }
  .commentright {
    text-align: left;
    h3 {
      height: 1.2rem;
      line-height: 1.2rem;
      font-size: .9rem;
    }
    p {
      padding: .3rem 0;
      font-size: .75rem;
      width: 100%;
      max-width: 20rem;
    }
    .time {
      height: 1.5rem;
      line-height: 1.5rem;
      padding: 0.2rem 0;
      span {
        color: #cbcbcb;
        font-size: .6rem;
      }
    }
  }
}
.commentBox::after {
  position: absolute;
  box-sizing: border-box;
  content: ' ';
  pointer-events: none;
  left: 2.8rem;
  bottom: -0.2rem;
  border-bottom: 1px solid #ebedf0;
  transform: scaleY(0.5);
  width: 90%;
}  
// 发布评论
.inpComment{
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 3.5rem;
  background: #F8F4F6;
  z-index: 999;
  padding: 0 0.9375rem ;
  // .inp{
  //   margin: 0 0.9375rem;
  //   border: 1px solid #eee;
  //   height: 1.5rem;
  //   border-radius: .75rem;
  // }
}
</style>
<style lang="scss">
.van-nav-bar {
  background-color: #fafbff;
}
.inpComment{
  .van-field{
    margin-top: .3rem;
     border: 1px solid #eee;
    height: 1.9rem;
    border-radius: .75rem;
    font-size: 1rem;
    line-height: 1rem;
    color: #999;
    padding: 0.2rem 1rem;
  }
}
</style>
