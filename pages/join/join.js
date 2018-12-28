Page({
  /**
   * 页面的初始数据
   */
  data: {
    // src:"../image/join.png"
    src:" ",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id = wx.getStorageSync('userId');
    this.setData({
        src: "https://qmds.jsdianshi.com/wx/join?uid="+id + "&flag=1"
    })
  },
})