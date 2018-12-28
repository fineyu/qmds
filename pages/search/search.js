// pages/search/search.js
var http = require('../../service/http.js');
const app = getApp();

// 全局变量
var arr = [];
var recentsearch = [];
// 热门搜索
function gatHotSearch(that) {
  http.getReq("/api/search", function (res) {
   
    arr = res.data;
  
    that.setData({
      hotSearch: arr,
    })
  })
}

Page({
  data: {
    recent:1,
    search: '',
    focus: true,
    hot: "热门搜索",
    hotSearch: [],
    recentSearch: [],
    delateSrc: "../image/delate.png",
  },
 
  onShow: function () {
    var recent = wx.getStorageSync("recentsearch");
   
    for(var i=0;i<recent.length;i++){
      if (recent[i].search==""){
        recent.splice(i, 1);
        this.setData({
          recent: 1,
        })
      }
    }
    // 判断是否有最近搜索
    if (recent.length == 0) {
      this.setData({
        recent: 1,
      })
    } else {
      this.setData({
        recent: 0,
        recentSearch: recent,
      })
    }
  },
  // 输入框失去焦点
  onBindBlur: function (e) {
    var product = e.detail.value;
    var obj = {};
    obj.search = String(product);
    recentsearch.push(obj);
    // 数组去重  不重复显示搜索内容
    for (var i = 0; i<recentsearch.length;i++){
      for (var j = i+1; j < recentsearch.length; j++){
        if (recentsearch[i].search == recentsearch[j].search || recentsearch[j].search==""){
           recentsearch.splice(j,1);
        }
      }
    }
    wx.setStorageSync("recentsearch", recentsearch);
    var search = wx.getStorageSync("recentsearch");
    // 判断是否有最近搜索
    if (recentsearch.length==0){
      this.setData({
        recent:1
      })
    }else{
      if (product == "") {
        return false;
      } else {
        this.setData({
          recentSearch: search,
          recent:0,
        })
        wx.navigateTo({
          url: '../productList/productList?product=' + product,
        })
      }
    }
  },
  recentSearch:function(e){
   
    var index=e.currentTarget.dataset.index;
    
    var recentSearch = this.data.recentSearch;
    var product = recentSearch[index].search;
    
    wx.navigateTo({
      url: '../productList/productList?product=' + product,
    })
    this.setData({
      search:product,
    })
  },
  hotSearch: function (e) {
    
    var index = e.currentTarget.dataset.index;
   
    var hotSearch = this.data.hotSearch;
    var product = hotSearch[index].title;
   
    wx.navigateTo({
      url: '../productList/productList?product=' + product,
    })
    this.setData({
      search: product,
    })
  },
  // 点击清空记录
  delateRecent: function () {
    wx.removeStorageSync('recentsearch');
    var recent = wx.getStorageSync("recentsearch");
    if (recent.length == 0) {
      this.setData({
        recentSearch: recent,
        recent: 1,
      })
    }
    wx.removeStorageSync('recentsearch');
  },
  onLoad: function () {
    var that = this;
    gatHotSearch(that);
  }
})