<template>
  <div class="all">
    <van-sticky>
      <div class='header '>
        <span>{{$t('library.library')}}</span>
        <div class='header-right'>
          <div class="r-icon" @click="editList" v-show="showEdit"><img src="~img/library/edit.png" alt=""></div>
          <div class="r-icon"  @click="showSearch = true"><img src="~img/common/search.png" alt=""></div>
        </div>
      </div>
    </van-sticky>

    <div class="main" v-show="bookCount > 0">
      <!-- <div class="fav-top">
        <div class="book-list" v-for="book in headBook" :key="book.book_id" @click="itemClick(book)">
          <div class="book-cover">
            <img :src="book['cover']" class="list-avatar">
          </div>

          <div class="book-info">
            <div class="book-title">
              <span>{{book['name']}}</span>
              <div class="book-choose" v-show="isEdit">
                <img src="~img/library/status-uncheck.png" v-show="checkList.indexOf(book.book_id) == -1">
                <img src="~img/library/status-check.png" v-show="checkList.indexOf(book.book_id) != -1">
              </div>
            </div>

            <div class="book-desc">
              <span>{{book.last_chapter_date}}</span> | {{book.last_chapter_title}}
            </div>

            <div class="book-progress">
              <div class="info-progress">
                <div class="progress-line">
                  <div class="progress-value" :style="{'width': getProgress(book)}"></div>
                </div> 
                <div class="progress-precent">{{getProgress(book)}}</div>
              </div>
            </div>

            <div class="book-bot-info">
              <div class="info-cat">{{book.tag[0].tab}}</div>
              <div class="info-action">Continue</div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="fav-list" v-show="bookCount > 0">
        <div class="book-list" v-for="book in bookList" :key="book.book_id" @click="itemClick(book)">
          <div class="book-cover">
            <img :src="book.cover" class="list-avatar">
            <img src="~img/library/new.png" alt="" class="list-tag"  v-show="book.last_read_idx == 0">
          </div>

          <div class="book-info">
            <div class="book-title">
              <span>{{book.name}}</span>
              <div class="book-choose" v-show="isEdit">
                <img src="~img/library/status-uncheck.png" v-show="checkList.indexOf(book.book_id) == -1">
                <img src="~img/library/status-check.png" v-show="checkList.indexOf(book.book_id) != -1">
              </div>
            </div>

            <div class="book-desc">
              <span>{{book.last_chapter_date}}</span> | {{book.last_chapter_title}}
            </div>

            <div class="book-progress">
              <span class="read-to" v-show="book.last_read_idx != 0">{{$t('library.readTo')}} &nbsp;</span><span>{{book.last_read_title}}</span>
            </div>

            <div class="book-bot-info">
              <div class="info-cat" v-if="book.tag[0]">{{book.tag[0].tab}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="nodata-img" v-show="bookCount == 0"><img src="~img/common/no-data.png"></div>

    <a @click="goGenre" class="more-book">{{$t('msg.moreBook')}}</a>

    <div class="bot-warp" v-show="isEdit">
      <div class="bot-cancel" @click="editList">{{$t('msg.cancel')}}</div>
      <div class="bot-del" @click="delAction">{{$t('msg.remove')}}</div>
    </div>

    <Login :showLogin="showLogin" @closePopup="closePopup"/>
    <Search :closepoup.sync="showSearch" :show="showSearch" />
  </div>
</template>

<script>
import {favList, delFav, userCheck} from '@/http/api'
import {Dialog} from 'vant'
import Login from '@/components/User/login'
import Search from "@/components/Search";

export default {
  components: {
    Dialog,
    Login,
    Search
  },

  data() {
    return {
      bookCount: 0, // 书籍数量
      // headBook: [], // 头部书籍
      bookList: [], // 下面的书籍列表
      checkList: [], // 选中书籍列表
      isEdit: false, // 是否为编辑状态
      showLogin: false, // 是否显示登录框
      showSearch: false,
      showEdit: false // 是否显示编辑标签
    }
  },
  mounted() {
    this.getFavList()

    userCheck(this.$cookie.get("requireParams")).then(res => {
      if (res.code) { // 未登录，弹框登录
        this.showLogin = true
      }
    })
  },
  methods: {
    // 获取收藏书籍李彪
    getFavList() {
      favList(JSON.parse(this.$cookie.get('requireParams'))).then(res => {
        this.bookCount = res.data.total_count
        if (this.bookCount == 0) { // 没有数据
          return
        }
        // 书架有数据才显示编辑按钮
        this.showEdit = true
        this.bookList = res.data.list
        // if (res.data.current_page == 1) { // 如果是第一页，需要设置一下第一本书籍
        //   this.headBook = [res.data.list[0]]
        //   this.bookList = res.data.list.slice(1)
        // } else { // 其他情况直接赋值
        //   this.bookList = res.data.list
        // }
      })
    },

    goGenre() {
      this.$router.push({'path': '/genre'})
    },

    getProgress(book) { // 计算进度条
      return parseInt(book.last_read_idx / book.total_chapter) + '%'
    },

    editList() { // 编辑书架列表按钮
      userCheck(this.$cookie.get("requireParams")).then(res => {
        if (res.code) { // 未登录，弹框登录
          this.showLogin = true
          return
        }
        this.isEdit = !this.isEdit
      })
    },

    itemClick(book) { // 书籍点击事件
      const bookId = book.book_id
      // 如果非编辑的状态，需要直接跳转阅读页
      if (!this.isEdit) {
        const bookParams = {
          book_id: bookId, chapter_id: book.last_read_id
        }
        this.$cookie.set('bookParams', JSON.stringify(bookParams), 1)
        this.$router.push({path: '/reader', query: {'book_id': bookId, 'chapter_id': book.last_read_id}})
        return;
      }

      let indexOf = this.checkList.indexOf(bookId)
      if (indexOf == -1) { // 没有数据表示选择次数，添加入数组
        this.checkList.push(bookId)
      } else { // 取消选择为移除出数组
        this.checkList.splice(indexOf, 1)
      }
    },

    delAction() { // 删除书籍
      if (this.checkList.length == 0) { // 未选择书籍
         Dialog.alert({
            title: 'Notice',
            message: 'Please select at least one book',
            confirmButtonText: 'Comfirm'
          }).then(() => {
            // on close
        });
        return;
      }

      // 选择删除
      Dialog.confirm({
        title: 'Remove',
        message: 'Remove from library',
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel'
      })
      .then(() => {
        // 请求服务端删除数据
        let bookIds = this.checkList.join(',')
        delFav(Object.assign(JSON.parse(this.$cookie.get('requireParams')), {'book_id': bookIds})).then(res => {
          // 移除列表中的书籍
          this.checkList.forEach(bookId => {
            this.bookList.forEach((book, i) => {
            // 此本书需要删除
              if (book.book_id == bookId) {
                this.bookList.splice(i, 1)
                return
              }
            })
          })

          // 如果删除的是第一本书，还需要额外操作
          // if (this.checkList.indexOf(this.headBook[0].book_id) != -1) {
          //   // 删除此本书
          //   this.headBook.splice(0);
          //   // 如果下面书籍列表有书，把列表第一本书推到这个数组
          //   if (this.bookList.length > 0) {
          //     this.headBook.push(this.bookList.shift())
          //   }
          // }

          // 是否还剩余书籍
          this.bookCount -= this.checkList.length
          if (this.bookCount == 0) { // 书籍被全部删了，隐藏编辑标签
            this.showEdit = false
          }
          // 每次删除后，隐藏编辑按钮
          this.isEdit = false
        })
      })
      .catch(() => {
        
      });
    },

    closePopup() { // 关闭弹窗
      this.showLogin = false;
    },
  }
}
</script>

<style scoped lang="scss">
.all {
    // height: 100%;
    // overflow-y: scroll;
    padding-bottom: 30vh;
  .header {
    width: 100%;
    height: 2.5rem;
    padding: 0 0.9375rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fafbff;
    span {
      text-align: left;
      width: 6.34375rem;
      height: 1.5625rem;
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1.5625rem;
      color: #1a1a1a;
    }
    .header-right {
      display: flex;
      align-items: center;
      .r-icon {
        width: 1.875rem;
        height: 1.875rem;
        margin-left: 0.9375rem;
        justify-content: center;
        background: #fff;
        box-shadow: 0 0.0625rem 0.625rem #f0f0f0;
        border-radius: 50%;
        img {
          width: 90%;
          height: 90%;
          margin: 0 auto;
          margin-top: 5%;
        }
      }
    }
  }

  .main {
    text-align: left;
    .book-list {
      display: flex;
      justify-content: space-between;
      position: relative;
      .book-cover {
        width: 5rem;
        height: 6.65625rem;
        position: relative;
        .list-avatar {
          width: 100%;
          height: 100%;
          border-radius: .3rem;
        }
        .list-tag {
          position: absolute;
          border-radius: 0.3rem 0 0 0;
          width: 1.8rem;
          height: 0.79rem;
          top: 0;
          left: 0;
        }
      }

      .book-info {
        width: 0;
        flex: 1;
        margin-left: 0.625rem;
        .book-title {
          display: flex;
          justify-content: space-between;
          span {
            width: 12.5rem;
            height: 2.8125rem;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.40625rem;
            color: #1a1a1a;
            padding-right: 0.3125rem;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .book-choose {
            width: 1.25rem;
            img {
              width: .8rem;
              height: .8rem;
            }
          }
        }
        .book-desc {
          font-size: .75rem;
          color: #b3b3b3;
          margin-top: 0.125rem;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .book-progress {
          height: 1.6875rem;
          display: flex;
          align-items: center;
          .info-progress {
            display: flex;
            align-items: center;
            .progress-line {
              width: 6.8125rem;
              height: 0.1875rem;
              background: #dad5ff;
              border-radius: 0.09375rem;
              .progress-value {
                position: relative;
                top: 0;
                left: 0;
                height: 0.1875rem;
                background: #9b8cff;
                border-radius: 0.09375rem;
              }
            }
            .progress-precent {
              font-size: .625rem;
              color: #9b8cff;
              margin-left: 0.1875rem;
            }
          }
          span {
            font-size: .68rem;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          .read-to {
            color: #999;
          }
        }

        .book-bot-info {
          width: 100%;
          height: 1.1875rem;
          position: relative;
          .info-cat {
            height: 1.125rem;
            border: 0.05rem solid #9b8cff;
            border-radius: 1.5625rem;
            line-height: 1.125rem;
            color: #9b8cff;
            font-size: .75rem;
            text-align: center;
            padding: 0 0.625rem;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
          }
          .info-action {
             position: absolute;
            bottom: 0;
            right: 0;
            width: 4.5625rem;
            height: 1.53125rem;
            font-size: .75rem;
            color: #fff;
            text-align: center;
            line-height: 1.53125rem;
            background-image: url(~img/library/button.png);
            background-size: 100% 100%;
          }
        }
      }
    }
    .book-list:last-child {
      margin-bottom: 0 !important;
    }
    .book-list::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      left: 0;
      bottom: -.4rem;
      border-bottom: 1px solid #ebedf0;
      transform: scaleY(0.5);
      width: 100%;
    }
    .book-list:last-child::after {
      border: none !important;
    }
    .fav-top {
      width: 21.5625rem;
      padding: 0.78125rem 0.9375rem;
      background: #fff;
      margin: 0 auto;
      box-shadow: 0 0.25rem 0.625rem #f0f0f0;
      border-radius: 0.25rem;
    }
    .fav-list {
      margin: 0.625rem auto 0;
      width: 21.5625rem;
      padding: 0.78125rem 0.9375rem;
      background: #fff;
      .book-list {
        margin-bottom: 1.03125rem;
      }
    }
  }

  .nodata-img img{
    width: 20.125rem;
    height: 20.125rem;
    margin: 6.25rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .more-book {
    margin: 1.0625rem auto 0;
    width: 14.03125rem;
    height: 2.375rem;
    border: 0.03125rem solid #9b8cff;
    opacity: 1;
    border-radius: 1.5625rem;
    line-height: 2.375rem;
    color: #9b8cff;
    text-align: center;
    display: block;
    font-size: 1rem;
  }

  .bot-warp {
    width: 23.4375rem;
    height: 5.25rem;
    background: #fff;
    box-shadow: 0 -0.09375rem 0.375rem #f0f0f0;
    border-radius: 1.8125rem 1.8125rem 0 0;
    position: fixed;
    z-index: 200;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .bot-cancel {
      width: 8rem;
      height: 1.75rem;
      line-height: 1.75rem;
      text-align: center;
      font-size: .875rem;
      border: 0.03125rem
      solid #fd4e6e;
      border-radius: 1.875rem;
      color: #fd4e6e;
    }
    .bot-del {
      width: 8rem;
      height: 1.75rem;
      background: #fd4e6e;
      border-radius: 1.875rem;
      color: #fff;
      margin-left: 0.9375rem;
      font-size: .875rem;
      line-height: 1.75rem;
    }
  }
}
</style>
