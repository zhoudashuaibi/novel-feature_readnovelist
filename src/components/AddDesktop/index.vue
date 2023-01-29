<template>
  <div>
    <div class="top-add" v-show="appInfo">
      <div class="app-info">
        <img src="~img/common/logo.png" alt="">
        <div class="name-info">
          <h3>Read Novelist</h3>
          <p>https://m.readnovelist.net</p>
        </div>
        <van-icon name="cross" class="close-icon"  @click="closeApp" />
      </div>
      <div class="add-info" @click="addInfo">+ {{$t('msg.addScreen')}}</div>
    </div>
    
    <van-popup v-model="showAdd" position="bottom" @close="closeAdd" @click="closeAdd">
      <div class="popup-content">
        <div class="bot-info">
          <span>{{$t('msg.tap')}}</span>
          <img src="~img/common/share.jpg" alt="">
          <span>{{$t('msg.then')}}</span>
          <img src="~img/common/add.jpg" alt="">
          <span class="add-home">{{$t('msg.addScreen')}}</span>
        </div>
        <div class="note-icon">
          <div class="trangle"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>

export default ({
  data() {
    return {
      showAdd: false, // 是否显示弹窗
      appInfo: true
    }
  },
  methods: {
    closeAdd() {
      this.showAdd = false
    },
    closeApp() {
      this.appInfo = false
    },
    addInfo() { // 点击添加到主屏幕
      this.showAdd = true
    }
  },
  mounted() {
  }
})
</script>

<style scoped lang="scss">
/deep/ .van-popup {
    background-color:transparent;
    height: 100%;
}
.top-add {
   .app-info {
    background-color: #fff;
    display: flex;
    padding: 1rem;
    padding-left: 1.2rem;
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 2rem;
    }
    .name-info {
      height: 2rem;
      text-align: left;
       margin-left: 0.5rem;
      width: 84%;
      h3 {
        font-weight: 700;
        font-size: .93rem;
      }
      p {
        font-size: .65rem;
        color: #999;
        line-height: .7rem;
      }
    }
    .close-icon {
      line-height: 2rem;
      font-size: 1rem;
      color: #ccc;
    }
  }

  .add-info {
    color: white;
    background-color: #1D8BFA;
    height: 2rem;
    line-height: 2rem;
    font-size: .8rem;
    font-weight: 500;
  }
}
.popup-content {
  .bot-info {
    background-color: #fff;
    position: absolute;
    bottom: 2rem;
    width: 90%;
    margin-left: 5%;
    height: 3rem;
    line-height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content:center;
    align-items:center;
    color: #666;
    font-size: .9rem;
    img {
      width: 1rem;
      height: 1rem;
      margin: 0 .2rem;
    }
    .add-home {
      color: #333;
      font-weight: 500;
      font-size: .9rem;
    }
  }  

  .note-icon {
    position: absolute;
    bottom: calc(1rem + 1px);
    left: calc(50% - .5rem);
    font-size: .7rem;
    .trangle {
      width: 0px;
      height: 0px;
      font-size: .8rem;
      border: .5rem solid #fff;
      border-top-color: white;  
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
    }
  }
}
</style>
