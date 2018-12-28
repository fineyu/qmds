//index.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
// 全局变量
var arr = [];
var classifyList = [];
var goodsList;
var isLoading = false;
// 轮播图请求
function getBannerList(that) {
  http.getReq("/api/banner", function (res) {
    arr = res.data;
    var imgs = [];
    for (var i = 0; i < arr.length; i++) {
      imgs[i] = arr[i].img_url
    };
    that.setData({
      imgUrls: imgs,
    })
  })
}
// 分类列表
function getClassifyList(that) {
  http.getReq("/api/sy-type", function (res) {
    classifyList = res.data;
    that.setData({
      classifyList: classifyList,
    })
  })
}
// 广告图请求
function getCommodityInfo(that) {
  http.getReq("/api/sy-re-goods", function (res) {
    var goodsInfo = res.data;
    goodsList = goodsInfo.goods;
    that.setData({
      adSrc: goodsInfo.img_url,
      goods: goodsInfo.goods
    })
  })
}
// 热销产品
function getRecGoods(that) {
  http.getReq("/api/sy-hot-goods", function (res) {
    // classifyList = res.data;
    that.setData({
      rec_goods: res.data,
    })
  })
}

Page({
  data: {
    kefuSrc:"../image/kefu.png",
    adSrc: "../image/guanggao.png",
    swiperCurrent: 0,
    imgUrls: [],
    classifyList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 2000,
    tuijian:"../image/index_tit.png",
    goods: [],
    rec_goods: [],
  },
  // 点击分类                  
  classifyClick: function (e) {
    var index = e.currentTarget.dataset.index;

    if (index == 9) {
      wx.switchTab({
        url: '../classify/classify'
      })
    } else {
      var id = classifyList[index].id;
      var titleName = classifyList[index].title;
      wx.setStorageSync("titleName", titleName);
      wx.navigateTo({
        url: "../product/product?id=" + id
      })
    }

  },

  onLoad: function (options) {
    var that = this;
    if (options.goods_id) {
      wx.setStorageSync("goods_id", options.goods_id);
      wx.navigateTo({
        url: '../logs/logs'
      })
    }
    // 轮播
    getBannerList(that);
    // 分类列表
    getClassifyList(that);
    // 广告请求
    getCommodityInfo(that);
    // 热销产品
    getRecGoods(that);

  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  
  // 商品列表点击
  indexProClick: function (e) {
    var index = e.currentTarget.dataset.index;
    var goods_id = goodsList[index].id;
    wx.setStorageSync("goods_id", goods_id);
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 转发
  onShareAppMessage: function (options) {
    var shareObj = {
      title: '欢迎来到千亩大叔', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
    }
    return shareObj;
  },
  // 热销产品点击
  hotProductClick:function(e){
    var index=e.currentTarget.dataset.index;
    var rec_goods = this.data.rec_goods;
    var goods_id = rec_goods[index].id;
    wx.setStorageSync("goods_id", goods_id);
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 轮播点击
  topCarouselClick:function(e){
    var index = e.currentTarget.dataset.index;
    var imgUrls = this.data.imgUrls;
    var goods_id = arr[index].id;
    wx.setStorageSync("goods_id", goods_id);
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 上拉刷新
  onPullDownRefresh: function () {
    var that = this;
    // 轮播
    getBannerList(that);
    // 分类列表
    getClassifyList(that);
    // 广告请求
    getCommodityInfo(that);
    // 热销产品
    getRecGoods(that);
    wx.stopPullDownRefresh();

  }

})