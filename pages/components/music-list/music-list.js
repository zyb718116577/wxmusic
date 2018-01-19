const app = getApp().globalData
const util = require('../../../utils/util.js')

Component({
  data: {
    zIndex: 50
  },
  properties: {
    title: {
      type: String,
      value: 'Chicken Music'
    },
    image: String,
    songs: {
      type: Array,
      value: []
    }
  },
  ready: function () {
    this.setSonglistTop()
    this._setTitle(this.properties.title)

    // 动态设置歌手头像背景图
    this.setData({
      bgStyle: `background-image:url(${this.properties.image})`
    })

    console.log(this.properties.songs)
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
      console.log(util.randomNum(this.properties.songs.length))
      wx.switchTab({
        url: '/pages/player/player'
      })
    }
  }
})