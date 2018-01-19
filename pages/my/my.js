const app = getApp()
const TEN_MINUTES = 600000

Page({
  data: {
    actionSheetsTime: ['关闭', '10分钟', '20分钟', '30分钟'], // 定时关闭选项
    actionSheetsWifi: ['开启', '关闭']
  },
  onLoad: function () {
    const _this = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: function (e) {
          if (e.errMsg == 'getUserInfo:fail auth deny') {
            _this.toAauthorize()
          }
        }
      })
    }
  },
  // 拒绝授权
  toAauthorize: function () {
    wx.showModal({
      title: '警告',
      content: '用户拒绝了授权，可能会导致某些功能无法正常使用!是否重新授权？',
      confirmText: '是',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              console.log(res);
            }
          });
        }
      }
    })
  },
  showActionSheets: function (e) {
    const itemList =  e.currentTarget.dataset.type
    const type = e.currentTarget.dataset.types
    const _this = this
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (type == 'time') {
          setTimeout(() => {
            wx.navigateBack({
              delta: 0
            })
          }, 5000)
        } else {
          _this.setData({
            test: !_this.data.test
          })
          console.log(_this.data.test)
        }

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
