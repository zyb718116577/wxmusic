//index.js
//获取应用实例
const app = getApp()
const api = require("../../utils/api.js")

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_modal_Hidden:false,
    is_modal_Msg:'我是一个自定义组件',
    slider: [],
    list: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getRecommenData()
  },
  getRecommenData: function () {
    const _that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1&jsonpCallback=callback",
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        platform: 'h5',
        uin: 0,
        needNewCode: 1,
        jsonpCallback: 'callback'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          var res1 = res.data.replace("callback(", "")
          var res2 = JSON.parse(res1.replace(")", ""))
          _that.setData({
            slider: res2.data.slider,
            songList: res2.data.songList
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toSingerPage: function (event) {
    app.globalData.selectsinger = {}
    app.globalData.selectsinger.name = event.currentTarget.dataset.title
    app.globalData.selectsinger.avatar = event.currentTarget.dataset.image
    app.globalData.selectsinger.id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },
  toSearch: function (e) {
    console.log(e)
  }
})
