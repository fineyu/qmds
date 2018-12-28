//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var classId;
var list = [];
var randType = '';
var titleName;
// 获取商品列表
var isLoading=false;



function getProductList(that, offset) {
  isLoading=true;
  http.postReq("/api/goods-list", { type: classId, province: '', city: '', district: '', limit: 10, offset: offset, flag: randType, keywords: '' }, function (res) {
   
    isLoading = false;
    wx.stopPullDownRefresh();
    if (res.state) {
      titleName = wx.getStorageSync("titleName");
     
      if (res.data.length != 0) {
        for (var i = 0; i < res.data.length; i++) {
          list.push(res.data[i]);
        }
      }
      that.setData({
        array: list,
        search: titleName
      })
      if (res.data.length == 0) {
        that.setData({
          hidden:false
        })
      }
    }
  })

}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qmSrc:"../image/qm.png",
    hidden:true,
    search: '',
    isshow: false,
    current: 1,
    currentId: 0,
    time: "发布时间",
    high: '价格从高到低',
    low: '价格从低到高',
    sortSrc: "../image/sanjiaoxing.png",
    sort: "排序",
    array: [

    ],
  },
  // 点击排序
  sortClick: function (e) {
    var that = this;
    var id = e.currentTarget.id;

    if (that.data.current == id) {
    } else {
      that.setData({
        current: id,
      })
    };
   
    that.setData({
      isshow: !that.data.isshow
    })
  },
  // 点击销量优先
  precedenceClick: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    randType = '';
    if (that.data.current == id) {
      return false;
    } else {
      that.setData({
        current: id,
      })
    };
    that.setData({
      sort: "排序",
      isshow: false,
      currentId: 0,
    })
    list = [];
    getProductList(that, 0);
  },
  // 排序里面点击
  // 发布时间点击
  timeClick: function (e) {
    var that = this;
    var index = e.currentTarget.id;
   
    if (that.data.currentId == index) {
    } else {
      that.setData({
        currentId: index,
      })
    }
    that.setData({
      isshow: !that.data.isshow
    })
    that.setData({
      sort: "发布时间"
    })
    list = [];
    randType = '2';
    getProductList(that, 0);
  },
  // 价格从高到低
  highClick: function (e) {
    var that = this;
    var index = e.currentTarget.id;
  
    if (that.data.currentId == index) {
    } else {
      that.setData({
        currentId: index,
      })
    }
    that.setData({
      isshow: !that.data.isshow
    })
    that.setData({
      sort: "价格从高到低"
    })
    list = [];
    randType = '3';
    getProductList(that, 0);
  },
  // 价格从低到高
  lowClick: function (e) {
    var that = this;
    var index = e.currentTarget.id;
   
    if (that.data.currentId == index) {
    } else {
      that.setData({
        currentId: index,
      })
    }
    that.setData({
      isshow: !that.data.isshow
    })
    that.setData({
      sort: "价格从低到高"
    })
    list = [];
    randType = '4';
    getProductList(that, 0);
  },
  // 商品点击
  productClick: function (e) {
   
    var index = e.currentTarget.dataset.index;
    var goods_id = list[index].id;
    wx.setStorageSync("goods_id", goods_id);
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 搜索框聚焦点跳转
  onBindFocus: function (e) {

    wx.navigateTo({
      url: '../search/search',
    })
  },
  onLoad: function (options) {
    var that = this;
    classId = options.id;
    list = []
    getProductList(that, 0);
  },

  // 上拉加载
  onReachBottom: function () {
    var that = this;
    if (!isLoading) {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    console.log(list.length)
    getProductList(that, list.length);
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    if(!isLoading){
    list = [];
    getProductList(that, 0);
    }
  }

})