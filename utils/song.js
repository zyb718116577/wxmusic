function Song({id, mid, singer, name, album, duration, image, musicId}) {
  this.id = id
  this.mid = mid
  this.singer = singer
  this.name = name
  this.album = album
  this.duration = duration
  this.image = image
  this.musicId = musicId
}

function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    musicId: musicData.songid
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

function getLyric(musicid) {
  return new Promise((resolve, reject)=>{
    wx.request({
      url: `https://route.showapi.com/213-2?showapi_appid=54411&musicid=${musicid}&showapi_sign=55b7ca99e210452a86269a9f09def34c`,
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

module.exports = {
  createSong: createSong,
  getLyric: getLyric
}