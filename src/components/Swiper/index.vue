<template>
  <div class="swiperBox">
    <swiper v-if="list.length>1" ref="mySwiper" :options="swiperOption">
      <swiper-slide v-for="(item, index) in list" :key="index">
        <img :src="item.image" :alt="item.content">
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
// 页面引入swiper
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
var vm
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    list: {
      type: [Function, Array],
      default: null
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        loop: true,
        observer: true,
        observeParents: true,
        // spaceBetween: 10,
        on: {
          click() {
            const realIndex = this.realIndex
            vm.handleClickSlide(realIndex)
          }
        }
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  created() {
    vm = this
  },
  mounted() {
  },
  methods: {
    handleClickSlide(index) {
      const bookId = this.list[index].skip_content
      const params = {
        book_id: bookId,
        chapter_id: null
      }
      this.$cookie.set('bookParams', JSON.stringify(params), 1)
      // 点击跳转页面
      this.$router.push({path: '/detail', query: {'book_id': bookId}})
    }
  }
}
</script>

<style lang="scss">
.swiperBox{
  height: 9.125rem;
  margin-top: 1.5625rem;
  margin-bottom: -1.5625rem;
}
.swiperBox .swiper-container {
  width: 100%;
  height: 100%;
}
.swiperBox .swiper-container img {
  width: 100%;
  height: 100%;
}
.swiperBox .swiper-slide {
  width: 78%;
  text-align: center;
  font-size: 18px;
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 0 0.1rem;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  transition: 300ms;
  transform: scale(0.9);
}
.swiperBox .swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}
</style>
