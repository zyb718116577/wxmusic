const app = getApp().globalData
const song = require('../../utils/song.js')
const Lyric = require('../../utils/lyric.js')

let watch;

Page({
  data: {
    playurl: '',
    playIcon: 'icon-play',
    cdCls: 'pause',
    currentLyric: null,
    currentLineNum: 0,
    toLineNum: 0,
    currentSong: null,
    dotsArray: new Array(2),
    currentDot: 0
  },

  onShow: function () {
    console.log('onshow')
    this._init()
    this._getBackPlayfileName().then((res)=>{
      const current = res.res.currentPosition
      this.data.currentLyric.stop()
      this.data.currentLyric.seek(current * 1000)
    }).catch(()=>{

    })
  },

  //初始化
  _init: function () {
    let songslist = (app.songlist.length && app.songlist) || wx.getStorageSync('songlist')
    let currentSong = app.songlist[app.currentIndex] || (songslist && songslist[app.currentIndex])
    let duration = currentSong && currentSong.duration

    this.setData({
      currentSong: currentSong,
      duration: this._formatTime(duration),
      songslist: songslist,
      currentIndex: app.currentIndex
    })

    this._getPlayUrl(currentSong.mid)
    this._getLyric(currentSong)
  },

  // 获取背景播放音乐的songmidid
  _getBackPlayfileName: function () {
    return new Promise((resolve, reject) => {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          var dataUrl = res.dataUrl
          let ret = dataUrl && dataUrl.split('?')[0].split('/')[3]
          resolve({ret,res})
        },
        fail: function (e) {
          let ret = false
          reject(ret)
        }
      })
    })
  },

  // 获取播放地址
  _getPlayUrl: function (songmidid) {
    const _this = this
    wx.request({
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&loginUin=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&filename=C400${songmidid}.m4a&guid=3913883408&songmid=${songmidid}&callback=callback`,
      data: {
        g_tk: 5381,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'jsonp',
        hostUin: 0,
        loginUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 0,
        filename: `C400${songmidid}.m4a`,
        guid: 3913883408,
        songmid: songmidid,
        callback: 'callback',
      },
      success: function (res) {
        var res1 = res.data.replace("callback(", "")
        var res2 = JSON.parse(res1.substring(0, res1.length - 1))
        const playUrl = `http://dl.stream.qqmusic.qq.com/${res2.data.items[0].filename}?vkey=${res2.data.items[0].vkey}&guid=3913883408&uin=0&fromtag=66`
        _this._getBackPlayfileName().then((nowPlay) => {
          if (!(res2.data.items[0].filename === nowPlay.ret)) {
            _this._createAudio(playUrl)
          }
        }).catch((err) => {
          _this._createAudio(playUrl)
        })
      }
    })
  },

  // 创建播放器
  _createAudio: function (playUrl) {
    wx.playBackgroundAudio({
      dataUrl: playUrl,
      title: this.data.currentSong.name,
      coverImgUrl: this.data.currentSong.image
    })
    // 监听音乐播放。
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        playIcon: 'icon-pause',
        cdCls: 'play'
      })
    })
    // 监听音乐暂停。
    wx.onBackgroundAudioPause(() => {
      this.setData({
        playIcon: 'icon-play',
        cdCls: 'pause'
      })
    })
    // 监听音乐停止。
    wx.onBackgroundAudioStop(() => {
      app.currentIndex++
      this._init()
    })
    // 监听播放拿取播放进度
    const manage = wx.getBackgroundAudioManager()
    manage.onTimeUpdate(() => {
      this.setData({
        currentTime: this._formatTime(manage.currentTime),
        percent: manage.currentTime / this.data.currentSong.duration
      })
    })
  },
  // 获取歌词
  _getLyric: function (currentSong) {
    const _this = this
    this._getBackPlayfileName().then((res) => {
      const nowMid = res.ret.split('.')[0].replace('C400','')
      if (!(nowMid === currentSong.mid)){
        if (this.data.currentLyric) {
          this.data.currentLyric.stop && this.data.currentLyric.stop()
        }
        _this._getLyricAction(currentSong)
      }
    }).catch(() => {
      _this._getLyricAction(currentSong)
    })
  },

  // 获取处理歌词
  _getLyricAction: function (currentSong) {
    console.log('获取歌词')
    song.getLyric(currentSong.musicId).then((res) => {
      if (res.data.showapi_res_body.ret_code == 0) {
        const lyric = this._normalizeLyric(res.data.showapi_res_body.lyric)
        const currentLyric = new Lyric(lyric, this.handleLyric)
        this.setData({
          currentLyric: currentLyric
        })
        this.data.currentLyric.play()
      } else {
        console.log('无歌词')
        this.setData({
          currentLyric: {
            lines: [{txt: '暂无歌词'}]
          },
          currentText: ''
        })
      }
    })
  },
  // 去掉歌词中的转义字符
  _normalizeLyric: function (lyric) {
    return lyric.replace(/&#58;/g, ':').replace(/&#10;/g, '\n').replace(/&#46;/g, '.').replace(/&#32;/g, ' ').replace(/&#45;/g, '-').replace(/&#40;/g, '(').replace(/&#41;/g, ')')
  },
  // 歌词滚动回调函数
  handleLyric: function ({lineNum, txt}) {
    console.log(lineNum)
    this.setData({
      currentLineNum: lineNum,
      currentText: txt
    })
    if (lineNum > 5) {
      this.setData({
        toLineNum: lineNum - 5
      })
    }
  },
  _formatTime: function (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  },
  /*秒前边加0*/
  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },
  prev: function () {
    if ((app.currentIndex - 1) < 0) {
      app.currentIndex = this.data.songslist.length - 1
      this._init()
      return
    }
    app.currentIndex && app.currentIndex--
    this._init()
  },
  next: function () {
    if ((app.currentIndex + 1) == this.data.songslist.length) {
      app.currentIndex = 0
      this._init()
      return
    }
    app.currentIndex++
    this._init()
  },
  togglePlaying: function () {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        if (status == 1) {
          wx.pauseBackgroundAudio()
        } else {
          wx.playBackgroundAudio()
        }
      }
    })
    let timer = setInterval(() => {
      if (this.data.currentLyric) {
        this.data.currentLyric.togglePlay()
        clearInterval(timer)
      }
    }, 20)
  },
  openList: function () {
    if (!this.data.songslist.length) {
      return
    }
    this.setData({
      translateCls: 'uptranslate'
    })
  },
  close: function () {
    this.setData({
      translateCls: 'downtranslate'
    })
  },
  end: function () {
    console.log(2)
  },
  playthis: function (e) {
    const index = e.currentTarget.dataset.index
    app.currentIndex = index
    this._init()
    this.close()
  },
  changeDot: function (e) {
    this.setData({
      currentDot: e.detail.current
    })
  }
})