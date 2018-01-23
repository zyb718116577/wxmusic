const app = getApp()
const song = require('../../utils/song.js')
const api = require('../../utils/api.js')
Page({
  data: {
    songs: []
  },
  onLoad: function () {
    this.setData({
      title: app.globalData.selectsinger.name,
      image: app.globalData.selectsinger.avatar
    })

    this.getSingerDetail(app.globalData.selectsinger.id)
    app.globalData.fromSinger = false

  },
  getSingerDetail: function (singermid, startIndex = 0) {
    api.getSingerSongs(singermid, startIndex).then((res) => {
      var res1 = res.data.replace("callback(", "")
      var res2 = res1.substring(0, res1.length - 1)
      let ret = this._normallizeSongs(JSON.parse(res2).data.list)
      let nowData = this.data.songs
      nowData.length > 0 ? nowData = nowData.concat(ret) : nowData = ret
      this.setData({
        songs: nowData
      })
    })
  },
  _normallizeSongs: function (list) {
    let ret = []
    list.forEach((item) => {
      let {musicData} = item
      if (musicData.songid && musicData.albummid) {
        ret.push(song.createSong(musicData))
      }
    })
    return ret
  },
  /*上拉加载更多歌曲*/
  childEvent: function (e) {
    this.getSingerDetail(app.globalData.selectsinger.id, e.detail)
  }
})