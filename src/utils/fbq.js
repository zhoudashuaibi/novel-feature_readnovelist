export function addShelf(bookId) { // 加入书架
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'AddShelf' , {content_ids: [bookId]})
}

export function openInfo(bookId) { // 打开详情
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'OpenInfo' , {content_ids: [bookId]})
}

export function openReader(bookId) { // 打开详情阅读器
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'OpenReader' , {content_ids: [bookId]})
}

export function writeComment(bookId) { // 打开阅读器
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'WriteComment' , {content_ids: [bookId]})
}

export function search(keyword) { // 搜索
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'Search' , {content_name: keyword})
}

export function login() { // 登录
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'Login')
}

export function readChapter(bookId) { // 打开详情
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'ReadChapter' , {content_ids: [bookId]})
}

export function openRecharge() { // 打开充值页
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'OpenRecharge')
}

export function actionRecharge() { // 发起充值
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'ActionRecharge')
}

export function rechargeSuccess() { // 充值成功
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'RechargeSuccess')
}

export function rechargeFailed() { // 充值失败
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'RechargeFailed')
}

export function initiateCheckout(price) { // 添加购物车
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'InitiateCheckout', {value: price, currency: 'USD'})
}

export function completeRegistration() { // 完成注册
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'CompleteRegistration')
}

export function purchase(price) { // 购买成功
  if (typeof(fbq) == 'undefined') { // 未定义方法
    return
  }
  fbq('track', 'Purchase', {value: price, currency: 'USD'})
}



