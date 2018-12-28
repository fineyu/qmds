
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var status;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'../image/apple.jpg',
    proName:"大苹果",
    price:"￥18.00",
    num:"x1",
    oneSrc:"../image/pay.png",
    right:"../image/right.png",
    twoSrc:"../image/tuihuo.png",
    threeSrc:"../image/tousu.png"
  },
  // 申请退款
  clickTk:function(){
    if(status==3){
      wx.showToast({
        title: '卖家已发货，不能单独申请退款！',
        icon:"none",
        duration:2000,
      })
    }else {
      wx.navigateTo({
        url: '../drawback/drawback'
      })
    }
  },
  // 退款退货
  clickTkth:function(){
    if(status==2){
      wx.showToast({
        title: '卖家还没有发货，不能申请退款退货！',
        icon: "none",
        duration: 2000,
      })
    }else{
      wx.navigateTo({
        url: '../goodsback/goodsback'
      })
    }
   
  },
  // 联系客服、
  phone: function (e) {
    var gys_phone = wx.getStorageSync("gys_phone");
    wx.makePhoneCall({
      phoneNumber: gys_phone
    })
  },
  onLoad:function(){
    var that=this;
    
    var orderInfo = wx.getStorageSync("orderInfo");
    that.setData({
      src: orderInfo.goods[0].img_url,
      proName: orderInfo.goods[0].goods_name,
      price: orderInfo.goods[0].price,
      num: orderInfo.goods[0].goods_num,
    })
  }
})