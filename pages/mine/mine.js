var http = require('../../service/http.js');
const app = getApp();
var usersInfo;
var loginFlag = '';
var uid = '';
// var arr=[];
var index;
//判断是否登录
function needLogin() {
  wx.showModal({
    // title: '您还未登录请您先登录',
    content:"您还未登录请您先登录",
    success: function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../login/login'
        })
      } else if (res.cancel) {

      }
    }
  })
}

// 用户信息的方法
function getUserNews(uid, that) {
  http.postReq("/api/user-info", { uid: uid }, function (res) {
   
    that.setData({
      header: res.data.head_pic,
      nickName: res.data.nickname,
      sign: res.data.sign,
    })
  })
}
// 获取商品数量
function getOrderNumber(that,uid) {
  var num;
  var arrs = that.data.array;
  http.postReq("/order/order-num", { uid: uid }, function (res) {
   
    if(res.state){
      var data = res.data;
      var a=0;
      for (var i = 0; i < data.length; i++) {
        if (i == 0 || i == 1 || i == 2 || i == 3 || i == 6) {                
          arrs[a].num = data[i];
          a++;
      }
      that.setData({
        array:arrs,
      })
  }

    }else{
      wx.showToast({
        title: res.msg,
        icon:"none",
        duration:2000,
      })
    }
    
  })
}
// 我的
Page({
  data: {
    kefuSrc: "../image/kefu.png",
    money:"我的钱包",
    about: "关于我们",
    orderName:"我的订单",
    order:"../image/mineorder.png",
    member: "我的订单",
    phonel: "绑定手机",
    idea: "意见反馈",
    contact: "联系客服",
    vip: "../image/order.png",
    cou: "../image/coupon.png",
    walletsrc: "../image/coupon.png",
    uphone: "../image/contact.png",
    right: "../image/right.png",
    join: "../image/join (1).png",
    adress: "../image/adress.png",
    sign: "你还没有个性签名哦",
    joinUs: "加盟我们",
    add: "收货地址",
    wallet:"../image/wallet.png",
    nums: ["0", "1", "0", "0", "0"],
    array: [
      { src: "../image/daifukuan.png", tit: "待付款" ,num:"0"},
      { src: "../image/daifahuo.png", tit: "待发货", num: "0" },
      { src: "../image/daishouhuo.png", tit: "待收货", num: "0"},
      { src: "../image/daipingjia.png", tit: "待评价", num: "0" },
      { src: "../image/shouhou.png", tit: "售后", num: "0"}
    ],
    nickName: "未登录",
    header: "../image/qm_header.png"
  },
  // 关于我们
  aboutUs: function () {
    // 判断用户是否登录 id是否为0
    if (uid == "") {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../aboutUs/aboutUs'
      })
    }

  },
  // 我的钱包
  myWallet:function(){
    // 判断用户是否登录 id是否为0
    if (uid == '') {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../myWallet/myWallet'
      })
    }
  },
  // 点击我的订单
  allOrders:function(e){
    if (uid == '') {
      needLogin();
      
    } else {
      wx.navigateTo({
        url: '../allOrder/allOrder?index=10'
       
      })
    }
  },
  // 联系客服、
  phone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-187-2008'
    })
  },
  // 点击设置修改内容
  changeNews: function () {
    // 判断用户是否登录 id是否为0
    if (uid == '') {
      needLogin();

    } else {
      wx.navigateTo({
        url: '../change/change'
      })
    }

  },
  
  // 收货地址
  address: function () {
    var uid = wx.getStorageSync('userId');
    // 判断用户是否登录 id是否为0
    if (uid == '') {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../add/add',
      })
    }

  },
  // 点击登录页面进行登录
  login: function () {
  
    if (loginFlag != '1') {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  //渲染页面
  onShow: function (options) {
    var that = this;
    uid = wx.getStorageSync('userId');
   
    if (uid != "") {
      loginFlag = '1';
      getUserNews(uid, that);
    } else {
      loginFlag = '';
     
      that.setData({
        nickName: "未登录",
        sign: "点击头像进行登录",
        header: "../image/qm_header.png"
      })
    }

    // var that = this;
    // var uid = wx.getStorageSync('userId');

    getOrderNumber(that, uid)
  },
  onLoad: function () {
    
  },
  // 点击设置修改内容
  changeNews: function () {
    if (uid == '') {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../change/change'
      })
    }

  },
  // 加入我们
  join: function () {
    // 判断用户是否登录 id是否为0
    if (uid == '') {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../join/join'
      })
    }
  },

  // 导航栏待付款点击
  navTap: function (e) {
    index = e.currentTarget.dataset.index;
  
    if (uid == "") {
      needLogin();
    } else {
      wx.navigateTo({
        url: '../allOrder/allOrder?index='+index
      })
    }
  },
  onShareAppMessage: function (options) {
    var shareObj = {
      title: '欢迎使用千亩大叔', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', // 默认是当前页面，必须是以‘/’开头的完整路径
    }
    return shareObj;
  },
  

  
})