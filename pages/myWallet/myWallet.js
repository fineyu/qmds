// pages/myWallet/myWallet.js
var http = require('../../service/http.js');
const app = getApp();
var uid;

function getMoney(uid, that) {
  http.postReq("/api/user-info", { uid: uid }, function (res) {
    console.log(res);
    that.setData({
      price: res.data.money,
    })
  })
}

Page({
  data: {
    price:"0.00",
    rightSrc:"../image/right.png",
    leftSrc:"../image/qianbao.png",
    src:"../image/walletbeijing.png"
  },

  // 提现
  tixian:function(){
    var that=this;
    var price=that.data.price;
    if(price=="0.00"){
      wx.showToast({
        title: '您没有可提现金额！',
        icon:"none",
        duration:2000,
      })
    }
    else{
      wx.navigateTo({
        url: '../withdrawMoney/withdrawMoney',
      })
    }
   
  
  },
  onShow:function(){
    var that=this;
    var uid = wx.getStorageSync('userId');
    getMoney(uid, that)
  }
})