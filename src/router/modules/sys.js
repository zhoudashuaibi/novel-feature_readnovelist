

// import Layout from '@/views/index.vue'
// const MODULE_NAME = 'system'
// const files = require.context('@/views/system', true, /\.vue$/)
// const sysRouter = {
//   path: `/${MODULE_NAME}`,
//   name: `/${MODULE_NAME}Link`,
//   component: Layout,
//   redirect: `/${MODULE_NAME}/welcome`,
//   meta: {
//     requireLogin: 'true',
//     requirePermission: true
//   },
//   children: []
// }

// files.keys().forEach((key) => {

//   const route = `/${MODULE_NAME}${key.substring(1, key.lastIndexOf('.'))}`
//   const name = route.replace(/\/(\w)/g, (...args) => (args[2] === 0 ? args[1] : args[1].toUpperCase()))
//   sysRouter.children.push({
//     path: route,
//     name: `${name}Link`,
//     component: (resolve) => require(['@/views/' + MODULE_NAME + key.substr(1)], resolve),
//     meta: {
//       requireLogin: true,
//       requirePermission: true
//     }
//   })
// })
// sysRouter.children.push({
//   path: '/system/welcome',
//   name: 'systemwelcome',
//   component: (resolve) => require(['@/views/welcome.vue'], resolve),
//   meta: {
//     requireLogin: false
//   }
// })
// sysRouter.children.push({
//   path: '/system/outer',
//   name: 'systemouter',
//   component: (resolve) => require(['@/views/iframe.vue'], resolve),
//   meta: {
//     requireLogin: false
//   }
// })
// sysRouter.children.push({
//   path: '/system/404',
//   name: 'systemunfoundLink',
//   component: resolve => require(['@/views/404.vue'], resolve),
//   meta: {
//     requireLogin: true
//   }
// })
// sysRouter.children.push({
//   path: '*',
//   beforeEnter(to, from, next) {
//     if (to.path.indexOf('http') !== -1) {
//       next({
//         path: '/system/outer',
//         query: {
//           link: to.fullPath.slice(to.path.indexOf('http'))
//         }
//       })
//     } else {
//       next({
//         path: '/system/404'
//       })
//     }

//   }
// })
// export default sysRouter
