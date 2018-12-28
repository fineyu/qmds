// pages/withdrawMoney/withdrawMoney.js
// pages/search/search.js
var http = require('../../service/http.js');
const app = getApp();
var name;
var account;
var money;
var uid;
// 申请提现
function applyMoney(){
  http.postReq("/order/apply-money", { uid: uid ,type: 1,name:name,account:account,money:money}, function (res) {
      if(res.state){
          wx.showToast({
            title: '您已提现成功',
            icon: "none",
            duration: 3000,
          })
        wx.navigateBack()
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration:2000,
        })
      }
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    waySrc:"../image/zffs.png",
    zfbSrc:"../image/zfb.png",
    priceSrc:"../image/pay.png",
    name:"",
    account:"",
    money:"",
  },

  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  account: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  money: function (e) {
    this.setData({
      money: e.detail.value
    })
  },
  applyMoney:function(){
   uid = wx.getStorageSync('userId');
   name=this.data.name;
   account=this.data.account;
   money=this.data.money;
    if(this.data.name==""){
      wx.showToast({
        title: '您没有填写姓名',
        icon:"none",
        duration:2000,
      })
      return false;
    }else if(this.data.account==""){
      wx.showToast({
        title: '您没有填写账号',
        icon: "none",
        duration: 2000,
      })
      return false;
    }else if(this.data.money==""){
      wx.showToast({
        title: '您没有填写姓金额',
        icon: "none",
        duration: 2000,
      })
      return false;
    }
   else{
     console.log(name,account,money)
      applyMoney(uid, 1, name, account, money)
    }
  },
})