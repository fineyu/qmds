// const app = getApp()
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var classifysArr=[];
var leftIndex=0;
var rightIndex=0;

// 大分类
function bigClassify(that){
  http.getReq("/api/big-type", function (res) {
    classifysArr=res.data;
    
    that.setData({
      array: classifysArr,
    })
    
  })
}

Page({
  data:{
    kefuSrc: "../image/kefu.png",
    index:0,
    activeIndex:0,
    array:[
     
    ]
  },
  // 左边点击
  leftClick:function(e){
    var th=this;
    leftIndex = e.currentTarget.dataset.index;
    　this.setData({
       activeIndex: leftIndex
    　});
  },
  // 右边点击
  rightClick:function(e){
    var rightIndex = e.currentTarget.dataset.index;
    var id = classifysArr[leftIndex].res[rightIndex].id;
    wx.setStorageSync("titleName",classifysArr[leftIndex].res[rightIndex].title);
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },
  onBindBlur:function(e){
   
  },
  onBindFocus: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onLoad:function(){
    var that=this;
    bigClassify(that)
  },
  onShareAppMessage: function (options) {
    var shareObj = {
      title: '欢迎使用千亩大叔', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
    }
    return shareObj;
  }
})