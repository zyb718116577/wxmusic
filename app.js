//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.onNetworkStatusChange(function(res) {
      //alert(res.isConnected)
      console.log(res.networkType)
    })
  },
  onShow: function () {
    //检测用户是否微信版本是否支持自定义组件
    this.checkVersion()
  },
  checkVersion: function () {
    const version = Number(wx.getSystemInfoSync().SDKVersion.split('.').join(''))
    const canUseComponent = 163
    if (version < canUseComponent) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        success: function(res) {
          if (res.confirm || res.cancel) {
            // 关闭小程序
            wx.navigateBack({
              delta: 0
            })
          }
        }
      })
    }
    return;
  },
  globalData: {
    userInfo: null,
    selectsinger: null,
    currentIndex: 0,
    fullScreen: false,
    songlist: [],
    playing: false,
    innerAudioContext: null
  }
})