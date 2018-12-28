// 意见反馈
Page({
  data:{
    ceshi:" "
  },
  onLoad: function (options) {
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
  },
  // bindTextAreaBlur: function (e) {
  //   this.setData({
  //     ceshi: e.detail.value
  //   })
  // },    
  bindFormSubmit: function (e) {
  
    this.setData({
      ceshi: " "
    })
  }
})