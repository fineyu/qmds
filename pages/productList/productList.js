// pages/productList/productList.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var list = [];
var keywords;
//获取商品列表
// var isLoading = false;

function getProductList(that, type, province, city, district, limit, offset, flag, keywords) {
  // isLoading = true;

  http.postReq("/api/goods-list", { type: type, province: province, city: city, district: district, limit: limit, offset: offset, flag: flag, keywords: keywords }, function (res) {

    // isLoading = false;
    list = res.data;

    that.setData({
      goods: list,

    })
    if (res.data.length == 0) {
      that.setData({
        hidden: false
      })
    }
  })

}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    qmSrc: "../image/qm.png",
    hidden: true,
    goods: [


    ]
  },
  indexProClick: function (e) {

    var index = e.currentTarget.dataset.index;

    var goods_id = list[index].id;

    wx.setStorageSync("goods_id", goods_id);
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    keywords = options.product;
    getProductList(that, "", 0, 0, 0, 100, 0, 2, keywords);
  },

  
})