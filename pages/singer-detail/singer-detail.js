const app = getApp()
const song = require('../../utils/song.js')
Page({
  onLoad: function () {
    this.setData({
      title: app.globalData.selectsinger.name,
      image: app.globalData.selectsinger.avatar
    })
    const from = app.globalData.fromSinger
    if (from) {
      this.getSingerDetail(app.globalData.selectsinger.id)
      app.globalData.fromSinger = false
    }
  },
  getSingerDetail: function (singermid) {
    const _this = this
    wx.request({
      url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=40&songstatus=1&singermid=${singermid}&jsonpCallback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 40,
        songstatus: 1,
        singermid: singermid,
        jsonpCallback: 'callback'
      },
      success: function (res) {
        var res1 = res.data.replace("callback(", "")
        var res2 = res1.substring(0, res1.length - 1)
        _this.setData({
          songs: _this._normallizeSongs(JSON.parse(res2).data.list)
        })
      }
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
  }

})