//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var orderId;
var orderInfo;
var shopPhone;
// 取消订单
function cancelOrders(order_id, that) {
  http.postReq("/order/cancel-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      orderDetails(orderId, that);
      wx.showToast({
        title: '取消成功',
        duration: 2000,
      })
    } else {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: 2000,
      })
    }
  })
}
// 删除订单
function delateOrders(order_id, that) {
  http.postReq("/order/del-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      orderDetails(orderId,that);
      wx.showToast({
        title: '删除成功',
        duration: 2000,
      })
      wx.navigateBack({

      })
    } else {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: 2000,
        
      })
    }
  })
}
// 确认收货
function confirmOrders(order_id, that) {
  http.postReq("/order/sure-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      orderDetails(orderId, that);
      wx.showToast({
        title: '确认收货',
        duration: 2000,
      })
    } else {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: 2000,
      })
    }
  })
}
// 提醒发货
function remindOrders(order_id, that) {
  http.postReq("/order/order-remind", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      wx.showToast({
        title: '已提醒发货',
        duration: 2000,
      })
    } else {
      wx.showToast({
        title: msg,
        icon: "none",
        duration: 2000,
      })
    }
  })
}

//去支付
function doPay(that) {
  http.postReq("/order/pay-wx-order", { order_id: orderId, openid: app.globalData.openid, pay_code: orderInfo.order_info.pay_code}, function (res) {
   
    if (res.code == 400 && res.code) {
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000
      })
    } else {

      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr + "",
        'package': res.package + "",
        'signType': 'MD5',
        'paySign': res.paySign + "",
        'success': function (res) {
          orderDetails(orderId,that);
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 3000,
          })
          
        }
      })
    }
  })
}



// 取消订单
function cancelOrders(order_id, that) {
  http.postReq("/order/cancel-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      wx.showToast({
        title: '取消成功',
        duration: 2000,
      })
      wx.navigateBack({
        
      })
    } else {
      wx.showToast({
        title: msg,
        duration: 2000,
      })
    }
  })
}

// 订单详情
function orderDetails(order_id,that){
  http.postReq("/order/order-detail", { order_id:order_id}, function (res) {
   
    orderInfo=res.data;
    var status = res.data.order_info.status;
    var status_name = res.data.order_info.status_name;
    var name = res.data.order_info.name;
    var phone = res.data.order_info.phone;
    var addr = res.data.order_info.addr;
    var img_url = res.data.order_info.goods[0].img_url;
    var goods_name = res.data.order_info.goods[0].goods_name;
    var price = res.data.order_info.goods[0].price;
    var goods_num = res.data.order_info.goods[0].goods_num; 
    var money = res.data.order_info.money;
    var order_code = res.data.order_info.order_code;
    var add_time = res.data.order_info.add_time;
    var gys_name = res.data.gys.gys_name;
    var gys_phone=res.data.gys_phone;
    var gys_img_url = res.data.gys.gys_img_url;
    var yunfei=res.data.order_info.yunfei;
    shopPhone=res.data.gys.phone;
  
    that.setData({
      yunfei: yunfei,
      status_name: status_name,
      name: name,
      phone: phone,
      addr: addr,
      img_url: img_url,
      goods_name: goods_name,
      price: price,
      goods_num: goods_num,
      money: money,
      order_code: order_code,
      add_time: add_time,
      gys_name: gys_name,
      status: status,
      gys_img_url: gys_img_url,
    })
    wx.setStorageSync("orderInfo", res.data.order_info)
   
    if (status==1){
      that.setData({
        hint:'您的订单还没有付款哦，赶紧去付款吧'
      })
    } else if (status==2){
      that.setData({
        hint: '您的订单已提交成功，坐等卖家发货'
      })
    } else if (status == 3) {
      that.setData({
        hint: '卖家已发货，坐等收货'
      })
    } else if (status == 4) {
      that.setData({
        hint: '订单已交易完成，去评价'
      })
    } else if (status == 5) {
      that.setData({
        hint: '您的订单已完成'
      })
    } else if (status == 6) {
      that.setData({
        hint: '您的订单已取消'
      })
    } else if (status == 7) {
      that.setData({
        hint: '您的订单处于售后状态'
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yunfei:"",
    gys_img_url:'',
    status:'',
    topSrc:"../image/dingdanxiangqingbeijing.png",
    hint:"",
    status_name:" ",
    name:"",
    phone:"",
    addr:"",
    wpay:"联系卖家",
    img_url:"",
    goods_name:"",
    price:"",
    goods_num:"",
    money:"",
    order_code:"",
    add_time:"",
    orderBuy:"微信支付",
    gys_name:''
  },
  onLoad:function(){
    var that=this;
    orderId=wx.getStorageSync("order_id");
   
    orderDetails(orderId,that);
  },
  // 申请售后
  clickAfterSale:function(){    
    wx.navigateTo({
      url: '../applyAfter/applyAfter',
    })
   
  },
  // 取消
  clickCancel:function(){
    var that=this;
    wx.showModal({
      title: '取消',
      content: '是否确认取消订单?',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          cancelOrders(orderId, that);
          wx.redirectTo({
            url: '../allOrder/allOrder',
          })
        }
      }
    })
    
  },
  // 删除
  clickDelate:function(){
    var that = this;
    
    wx.showModal({
      title: '确认删除',
      content: '是否确认删除订单?',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          delateOrders(orderId, that)
          wx.redirectTo({
            url: '../allOrder/allOrder',
          })
        }
      }
    })
    
  },
  // 确认收货
  clickConfirm:function(){
    var that = this;
    wx.showModal({
      title: '确认收货',
      content: '是否确认确认收货?',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          confirmOrders(orderId, that);
        }
      }
    })
    
  },
  // 提醒发货
clickRemind:function(){
    var that = this;
    remindOrders(orderId,that);
  },
  // 查看物流
  seelogister:function(){
    wx.setStorageSync("order_id", orderId);
    wx.navigateTo({
      url: '../logistics/logistics'
    })
  },
  // 点击评价
  comment: function () {
    var orderInfo=wx.getStorageSync("orderInfo");
    wx.setStorageSync("orderInfo", orderInfo);
    wx.navigateTo({
      url: '../comment/comment',
    })
  },
  // 付款
  clickPay:function(){
    var that=this;
    wx.showModal({
      title: '支付',
      content: '是否确认支付?',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          doPay(that);
        }
      }
    })
  },
  // 联系卖家
  shopPhoneClick:function(){
    wx.makePhoneCall({
      phoneNumber: shopPhone,
    })
  },
  // 售后详情
  shouhouClick:function(){
    
    wx.navigateTo({
      url: '../returnDetails/returnDetails?order_id=' + orderId
    })
  }
})