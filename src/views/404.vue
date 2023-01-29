<template>
  <div class="main">
    <img src="~img/common/404.png" alt="">
    <div class="btn-area">
      <div class="btn" @click="$router.push('/')">
        Back to Homepage
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafbff;
  img {
    width: 20rem;
    height: 20rem;
  }
  .btn-area {
    .btn {
      margin-top: 3.34375rem;
      width: 13.625rem;
      height: 2.71875rem;
      font-size: 1.125rem;
      border-radius: 2.71875rem;
      background: #9b8cff;
      color: #fff;
      line-height: 2.71875rem;
      text-align: center;
    }
  }
}
</style>
