<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-11-16 19:22:05
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-20 17:09:24
-->
<!--  -->
<template>
  <div class="answer">
    <van-sticky>
      <van-nav-bar title="Feedback" left-arrow @click-left="$router.go(-1)" />
    </van-sticky>
    <div class="section-title">
      <h1>{{$t('user.qa')}}</h1>
    </div>
    <div class="skeleton " v-if="skeleton" >
      <van-skeleton title :row="3" style="padding:10px 16px !important" />
    </div>
    <van-collapse v-model="activeName" :accordion="true">
      <van-collapse-item
        :title="`• ${item.name}`"
        :name="index"
        v-for="(item, index) in data"
        :key="index"
        class="wrap"
      >
        <van-collapse v-model="activeNames1" :accordion="true">
          <van-collapse-item
            :title="`•  (${indexs + 1})  ${items.title}`"
            :name="indexs"
            v-for="(items, indexs) in item.list"
            :key="indexs"
            class="inner"
          >
            {{ items.answer }}
          </van-collapse-item>
        </van-collapse>
      </van-collapse-item>
    </van-collapse>
    <div class="section-title">
      <h1>{{$t('user.question')}}</h1>
    </div>
    <div class="sendBox">
      <!-- 文本域 -->
      <van-field
        v-model.trim="content"
        rows="4"
        autosize
        type="textarea"
        maxlength="200"
        :placeholder="$t('user.ques_place')"
        show-word-limit
        @keyup="submitCheck"
      />
      <!-- 邮箱输入框 -->
      <van-field v-model.trim="contact" class="email" :placeholder="$t('user.ques_address')" @keyup="submitCheck"/>
      <!-- 上传图片 -->
      <div class="picBox">
        <!-- <van-image
          v-for="(item, index) in imgs"
          :key="index"
          width="5rem"
          height="5rem"
          fit="contain"
          :src="item"
        /> -->
        <!-- <van-uploader preview-full-image :after-read="afterRead" :before-read="beforeRead"  /> -->
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="4"
          :before-read="beforeRead"
        />
      </div>
      <!-- 提交按钮 -->
      <div class="submit" @click="postFeedback" :style="{'background-color': submitColor.background, 'color': submitColor.color}">{{$t('user.submit')}}</div>
    </div>
  </div>
</template>

<script>
import { answerList, upload, feedback } from "@/http/api";
export default {
  components: {},
  data() {
    return {
      data: [],
      activeName: ["1"],
      activeNames1: ["1"],
      content: "",
      contact: "",
      imgs: [],
      uploading: false,
      fileList: [],
      num: 0,
      submitColor: {
        background: '#f6f4f5',
        color: '#ccc'
      },
      skeleton:false
    };
  },
  computed: {},
  watch: {},
  methods: {
    getdata() {
      this.skeleton = true
      answerList(JSON.parse(this.$cookie.get("requireParams"))).then((res) => {
        this.data = res.data.help_list;
        this.skeleton = false
      });
    },
    // 图片上传之前的处理
    beforeRead(file) {
      if (file.type !== "image/jpeg") {
        this.$toast("Please upload pictures in JPG format");
        return false;
      }
      return true;
    },
    // 上传图片
    uploadImg() {
      this.fileList.forEach((e) => {
        upload(
          Object.assign(
            { image: e.content },
            JSON.parse(this.$cookie.get("requireParams"))
          )
        ).then((res) => {
          this.num += 1;
          this.imgs.push(res.data.img);
          console.log(this.num);
        });
      });
    },
    //提交反馈
    postFeedback() {
      //   console.log(this.fileList);
      this.uploadImg();
      this.$nextTick(() => {
        if (this.content === "" || this.contact === "") {
          this.$toast(
            "Feedback content or contact information cannot be empty"
          );
        } else {
          feedback(
            Object.assign(
              { imgs: this.imgs, contact: this.contact, content: this.contact },
              JSON.parse(this.$cookie.get("requireParams"))
            )
          ).then((res) => {
            console.log(res);
            this.$notify({
              type: "success",
              message: "Feedback submitted successfully !",
            });
            this.fileList = []
            this.content = ''
            this.contact = ''
          });
        }
      });
    },
    submitCheck() { // 检测是否达到提交标准
      if (this.contact != '' && this.content != '') { // 已填写资料
        this.submitColor.background = '#9b8cff'
        this.submitColor.color = '#fff'
      } else {
        this.submitColor.background = '#f6f4f5'
        this.submitColor.color = '#ccc'
      }
    }
  },
  created() {},
  mounted() {
    this.getdata();
  },
};
</script>
<style lang="scss">
.wrap {
  text-align: left;
  .van-icon {
    display: none;
  }
  .inner {
    .van-collapse-item__wrapper {
      .van-collapse-item__content {
        background-color: #f6f4f5;
        padding: 0.5rem 0.8rem;
        border-radius: 0.2rem;
        margin-left: 1rem;
      }
    }
  }
  .van-hairline--top-bottom::after {
    border: unset !important;
  }
  .van-cell,
  .van-collapse-item__content {
    background-color: #fafbff;
  }
}
.answer {
  .van-cell__value {
    background-color: #f6f4f5;
    border-radius: 0.2rem;
    padding: 0.3rem 0.5rem;
    .van-field__word-limit {
      color: #cbcbcb;
    }
  }
  .van-cell__value--alone,
  .van-field__control {
    color: #969799 !important;
  }
  .van-cell {
    background-color: #fafbff;
  }
  .van-cell::after {
    border: unset !important;
  }
}
.picBox {
  display: flex;
  padding: 10px 16px;
  flex-flow: wrap;
}
.submit {
  padding: 0.6rem 4.2rem;
  border-radius: 1.4rem;
  line-height: 1.6rem;
  height: 2.8rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  font-size: 1.3rem;
  color: #ccc;
}
.section-title {
  padding: .5rem 1rem;
  text-align: left;
  h1 {
    font-size: 1rem;
    font-weight: 500;
  }
}
</style>
