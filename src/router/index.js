/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-03 22:01:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-16 19:26:18
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import store from '@/store'
// import systemRouter from './modules/sys'
import { dataUp, userCheck, urlCheck } from '@/http/api'
import cookies from "vue-cookie";

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/discover',
    component: resolve => require(['@/views/index.vue'], resolve),
    meta: {
      requireLogin: false,
      // keepAlive: true
    },
    children: [
      {
        path: '/discover',
        name: 'discoverLink',
        component: resolve => require(['@/views/discover/index.vue'], resolve),
        meta: {
          requireLogin: false,
          keepAlive: true
        }
      },
      {
        path: '/library',
        name: 'libraryLink',
        component: resolve => require(['@/views/library/index.vue'], resolve),
        meta: {
          requireLogin: false,
          // keepAlive: true
        }
      },
      {
        path: '/profile',
        name: 'profileLink',
        component: resolve => require(['@/views/profile/index.vue'], resolve),
        meta: {
          requireLogin: false,
          // keepAlive: true
        }
      }
    ]
  },
  {
    path: '/',
    name: 'detail',
    redirect: '/detail',
    component: resolve => require(['@/views/detail/index.vue'], resolve),
    meta: {
      requireLogin: false
    },
    children: [
      {
        path: '/detail',
        name: 'detailLink',
        component: resolve => require(['@/views/detail/detail.vue'], resolve),
        meta: {
          requireLogin: false
        }
      },
      {
        path: '/reader',
        name: 'reader',
        component: resolve => require(['@/views/detail/reader.vue'], resolve),
        meta: {
          requireLogin: false
        }
      },
      {
        path: '/comment',
        name: 'comment',
        component: resolve => require(['@/views/detail/comment.vue'], resolve),
        meta: {
          requireLogin: false
        }
      }
    ]
  },

  {
    path: '/privacy-policy',
    name: 'privacyPolicy',
    component: resolve => require(['@/views/about/privacy-policy.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  {
    path: '/user-agreement',
    name: 'userAgreement',
    component: resolve => require(['@/views/about/user-agreement.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },

  {
    path: '/genre',
    name: 'genreLink',
    component: resolve => require(['@/views/discover/genre.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  {
    path: '/search',
    name: 'search',
    component: resolve => require(['@/views/search/index.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: resolve => require(['@/views/discover/ranking.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  // ???????????????
  {
    path: '/listPage',
    name: 'listPage',
    component: resolve => require(['@/views/discover/listPage.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  // ??????????????????
  {
    path: '/tagsPage',
    name: 'tagsPage',
    component: resolve => require(['@/views/discover/tagsPage.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  // ??????????????????
  {
    path: '/answerList',
    name: 'answerList',
    component: resolve => require(['@/views/profile/answerList.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },

  // ?????????
  {
    path: '/recharge',
    name: 'recharge',
    component: resolve => require(['@/views/profile/recharge.vue'], resolve),
    meta: {
      requireLogin: true
    }
  },

  // ???????????????
  {
    path: '/profile/login',
    name: 'loginPage',
    component: resolve => require(['@/views/profile/login.vue'], resolve),
    meta: {
      requireLogin: false
    }
  },
  {
    path: '/404',
    name: 'unfoundLink',
    component: resolve => require(['@/views/404.vue'], resolve),
    meta: {
      requireLogin: true
    }
  },

  // {
  //   path: '/401',
  //   name: 'unPermissionLink',
  //   component: resolve => require(['@/views/401.vue'], resolve),
  //   meta: {
  //     requireLogin: true
  //   }
  // },
  // {
  //   path: '*',
  //   beforeEnter(to, from, next) {
  //     if (to.path.indexOf('http') !== -1) {
  //       window.open(to.fullPath.slice(to.path.indexOf('http')))
  //     } else {
  //       next({
  //         path: '/404'
  //       })
  //     }
  //   }
  // }
]
const router = new Router({
  mode: "history",
  routes
})
// ????????????  ???????????????????????????????????????
router.beforeEach((to, from, next) => {
  // ????????????
  if (to.path != '/profile/login') { // ???????????????
    userCheck({'token': cookies.get('token')}).then(res => { // ???????????????????????????????????????????????????
      if (res.code != 0) {
        next({ path: '/profile/login', query: { redirect: to.fullPath } })
      }
    })
  }
  
  next()
})

// ???????????????????????????
// router.afterEach((to, from) => {
//   if (to.meta.keepAlive) {
//     setTimeout(() => {
//       document.documentElement.scrollTop = store.state.scrollTop;
//       document.body.scrollTop = store.state.scrollTop; // document.body.scrollTop??????????????????iOS????????????????????????????????????
//     }, 50)
//   }
// })

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
