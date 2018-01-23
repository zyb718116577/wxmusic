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
    is_modal_Hidden: false,
    is_modal_Msg: '我是一个自定义组件',
    slider: [],
    list: [],
    rankTitle: [{
      id: 4,
      name: '流行榜'
    }, {
      id: 6,
      name: '港台'
    }, {
      id: 3,
      name: '欧美'
    }, {
      id: 16,
      name: '韩国'
    }, {
      id: 17,
      name: '日本'
    }, {
      id: 26,
      name: '热歌'
    }, {
      id: 27,
      name: '新歌'
    }, {
      id: 28,
      name: '网络歌曲'
    }, {
      id: 32,
      name: '音乐人'
    }, {
      id: 36,
      name: 'K歌金曲'
    }],
    currentRankIndex: 0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getRecommenData()
    this._getRankData()
  },
  getRecommenData: function () {
    const _that = this
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
  getUserInfo: function (e) {
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
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '一个高颜值的音乐播放器。',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('分享成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('分享失败')
      }
    }
  },
  _selectItemRank: function (event) {
    const data = event.currentTarget.dataset.data
    app.globalData.topId = data.id
    wx.navigateTo({
      url: '/pages/top-list/top-list'
    })
  },
  _getRankData: function () {
    api.getTopList().then((res) => {
      var res1 = res.data.replace('jp1(', '')
      var res2 = JSON.parse(res1.substring(0, res1.length - 1))
      this.setData({
        topList: res2.data.topList
      })
    })
  }
})
