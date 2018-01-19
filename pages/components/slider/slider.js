Component({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    circular: true,
    indicatorActiveColor: 'rgba(255,255,255,0.8)',
    indicatorColor: 'rgba(255,255,255,0.5)',
    duration: 500
  },
  properties:{
    slider: Array
  },
  methods: {
    imgload: function (e) {
      let index= e.currentTarget.dataset.index
      if (!index) {
        wx.hideLoading()
      }
    }
  }
})