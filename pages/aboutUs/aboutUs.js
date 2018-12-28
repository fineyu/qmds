// pages/aboutUs/aboutUs.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();



Page({
  /**
   * 页面的初始数据
   */
  data: {  
    src:" ",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.getReq("/api/connect-our", function (res) {
      console.log(res)
      that.setData({
        src: "https://qmds.jsdianshi.com/site/about"
      })
    })
  },
})