/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2021-11-05 23:13:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-11-16 22:21:39
 */
// 将request.js整体导入
import request from './request'
import https from './http'
const { post } = https

// 用户登录检测
export function userCheck(data) {
  return request({
    url: '/wap/user/login-check',
    method: 'post',
    data
  })
}

// 用户登录检测
export function accountCheck(data) {
  return request({
    url: '/wap/user/account-check',
    method: 'post',
    data
  })
}

// 请求首页数据
export function bookIndex(data) {
  return request({
    url: '/wap/book/index',
    method: 'post',
    data
  })
}
// 书籍详情
export function bookInfo(data) {
  return request({
    url: '/wap/book/info',
    method: 'post',
    data
  })
}
// 章节详情
export function chapterText(data) {
  return request({
    url: '/wap/chapter/text',
    method: 'post',
    data
  })
}
// 目录
export function catalog(data) {
  return request({
    url: '/wap/book/catalog',
    method: 'post',
    data
  })
}
// 检测自动订阅
export function testAutoSub(data) {
  return request({
    url: '/wap/user/auto-sub-check',
    method: 'post',
    data
  })
}
// 设置自动订阅
export function setAutoSub(data) {
  return request({
    url: '/wap/user/auto-sub',
    method: 'post',
    data
  })
}
// 章节购买
export function buyChapter(data) {
  return request({
    url: '/wap/chapter/buy',
    method: 'post',
    data
  })
}
// 获取用户余额
export function userAssets(data) {
  return request({
    url: '/wap/user/assets',
    method: 'post',
    data
  })
}
// 是否收藏
export function collect(data) {
  return request({
    url: '/wap/user/collect',
    method: 'post',
    data
  })
}

// 设备登录
export function deviceLogin(data) {
  return request({
    url: '/wap/user/device-login',
    method: 'post',
    data
  })
}

// 谷歌登录
export function googleLogin(data) {
  return request({
    url: '/wap/user/google-login',
    method: 'post',
    data
  })
}

// fb登录
export function facebookLogin(data) {
  return request({
    url: '/wap/user/facebook-login',
    method: 'post',
    data
  })
}

// 收藏列表
export function favList(data) {
  return request({
    url: '/wap/user/library',
    method: 'post',
    data
  })
}

// 删除收藏
export function delFav(data) {
  return request({
    url: '/wap/user/collect-del',
    method: 'post',
    data
  })
}

// 个人中心
export function userCenter(data) {
  return request({
    url: '/wap/user/center',
    method: 'post',
    data
  })
}
// 搜索热词
export function hotWord(data) {
  return request({
    url: '/wap/book/hot-word',
    method: 'post',
    data
  })
}
// 搜索接口
export function search(data) {
  return request({
    url: '/wap/book/search',
    method: 'post',
    data
  })
}
// 推荐位换一换
export function refreshRecommend(data) {
  return request({
    url: '/wap/book/recommend-refresh',
    method: 'post',
    data
  })
}
// 获取分类列表
export function getCategory(data) {
  return request({
    url: '/wap/book/category',
    method: 'post',
    data
  })
}
// 获取分类小说列表
export function getCategoryBook(data) {
  return request({
    url: '/wap/book/category-books',
    method: 'post',
    data
  })
}
// 推荐位小说列表
export function recommendList(data) {
  return request({
    url: '/wap/book/recommend',
    method: 'post',
    data
  })
}
// 标签小说列表
export function tagBooks(data) {
  return request({
    url: '/wap/book/tag-books',
    method: 'post',
    data
  })
}
// 标签列表
export function tagList(data) {
  return request({
    url: '/wap/book/tags',
    method: 'post',
    data
  })
}
// 评论列表
export function commentList(data) {
  return request({
    url: '/wap/book/comment-list',
    method: 'post',
    data
  })
}
// 添加评论
export function addComment(data) {
  return request({
    url: '/wap/book/comment-add',
    method: 'post',
    data
  })
}
// 获取问答列表
export function answerList(data) {
  return request({
    url: '/wap/answer/list',
    method: 'post',
    data
  })
}
// 上传图片
export function upload(data) {
  return request({
    url: '/upload/image',
    method: 'post',
    data
  })
}
// 提交反馈
export function feedback(data) {
  return request({
    url: '/wap/answer/post-feedback',
    method: 'post',
    data
  })
}

// 数据上报
export function dataUp(data) {
  return request({
    url: '/wap/up/stat',
    method: 'post',
    data
  })
}

// 链接检查
export function urlCheck(data) {
  return request({
    url: '/wap/drp/url-check',
    method: 'post',
    data
  })
}

// 推广内容
export function drpInfo(data) {
  return request({
    url: '/wap/drp/info',
    method: 'post',
    data
  })
}

// 上报推广数据
export function reportDrp(data) {
  return request({
    url: '/wap/up/index',
    method: 'post',
    data
  })
}

// 上报阅读数据
export function upRead(data) {
  return request({
    url: '/wap/up/book-up-read',
    method: 'post',
    data
  })
}

// 上报阅读时长
export function readTime(data) {
  return request({
    url: '/wap/up/read-time',
    method: 'post',
    data
  })
}
