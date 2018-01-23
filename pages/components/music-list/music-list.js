const app = getApp().globalData
const util = require('../../../utils/util.js')

Component({
  data: {
    zIndex: 50
  },
  properties: {
    title: {
      type: String,
      value: 'Chicken Music',
      observer: function (newVal) {
        this._setTitle(newVal)
      }
    },
    image: {
      type:String,
      value: '',
      observer: function (newVal) {
        this.setData({
          bgStyle: `background-image:url(${newVal})`
        })
      }
    },
    songs: {
      type: Array,
      value: []
    }
  },
  ready: function () {
    this.setSonglistTop()
    this._setTitle(this.properties.title)
    console.log(this.properties.title)
    // 动态设置歌手头像背景图
    this.setData({
      bgStyle: `background-image:url(${this.properties.image})`
    })
  },
  methods: {
    /*针对不同手机设置songlist的top值*/
    setSonglistTop: function () {
      const _this = this
      wx.createSelectorQuery().in(this).select('#bgImage').boundingClientRect((rect) => {
        rect.height
      }).exec((res) => {
        _this.setData({
          top: res[0].height,
          oldTop: res[0].height //记录原始的top值
        })
      })
    },
    _setTitle: function (title) {
      wx.setNavigationBarTitle({
        title: title
      })
    },
    scroll: function (e) {
      let top = this.data.oldTop - e.detail.scrollTop > 0 ? this.data.oldTop - e.detail.scrollTop : 0
      const percent = Math.abs(e.detail.scrollTop / this.data.oldTop)
      if (e.detail.scrollTop > 20) {
        this.setData({
          zIndex: 0,
          bgZindex: 0
        })
      } else if (e.detail.scrollTop < 20 && e.detail.scrollTop > 0) {
        this.setData({
          zIndex: 50,
          bgZindex: 0
        })
      } else if (e.detail.scrollTop < 0) {
        this.setData({
          scale: `scale(${1 + percent})`,
          translate: `transform:translate3d(0px,${Math.abs(e.detail.scrollTop)}px,0px)`,
          bgZindex: 1,
          zIndex: 50
        })
        return
      }
      this.setData({
        top: top
      })
    },
    randomPlayall: function () {
      app.currentIndex = util.randomNum(this.properties.songs.length)
      app.songlist = this.properties.songs
      wx.switchTab({
        url: '/pages/player/player'
      })
    },
    /*向父组件推送滚动到底部的事件*/
    getMoreSongs: function () {
      this.triggerEvent('myevent', this.properties.songs.length)
    }
  }
})