//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var status='';
var list=[];
var orderInfo;
var orderID="";
var isLoading = false;
// 获取列表
function getAllOrders(that, offset){
  isLoading = true;
  var uid = wx.getStorageSync('userId');
  http.postReq("/order/order-list", { uid: uid, limit:20, offset: offset, status: status}, function (res) {
    console.log(res);
    isLoading = false;
    wx.stopPullDownRefresh();
    if(res.state){

      for(var i=0;i<res.data.length;i++){
        list.push(res.data[i]);
      }
      // 列表获取的赋值
      that.setData({
        allOrder: list,
      })
      // 如果没有更多即显示
    }else{
      wx.showToast({
        title: res.msg,
        icon:"none",
        duration:2000,
      })
    }
   
  })
 
}
//去支付
function doPay(that,orderId,payCode){
  http.postReq("/order/pay-wx-order", { order_id: orderId, openid: app.globalData.openid,pay_code:payCode }, function (res) {
   
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
          wx.setStorageSync("order_id", orderId);
          wx.navigateTo({
            url: '../orderDetails/orderDetails'
          })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 3000,
          })
          wx.setStorageSync("order_id", orderId);
          wx.navigateTo({
            url: '../orderDetails/orderDetails'
          })
        }
      })
    }
  })
}



// 取消订单
function cancelOrders(order_id,that){
  http.postReq("/order/cancel-order", { order_id: order_id}, function (res) {
    var state=res.state;
    if (state==true){
      list=[];
       getAllOrders(that)
       wx.showToast({
         title: '取消成功',
         duration: 2000,
       })
     }else{
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration:2000,
      })
     }
  })
}
// 删除订单
function delateOrders(order_id,that){
  http.postReq("/order/del-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      list = [];
      getAllOrders(that)
      wx.showToast({
        title: '删除成功',
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
// 确认收货
function confirmOrders(order_id, that){
  http.postReq("/order/sure-order", { order_id: order_id }, function (res) {
    var state = res.state;
    var msg = res.msg;
    if (state == true) {
      list = [];
      getAllOrders(that)
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
function remindOrders(order_id, that){
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

Page({
  data: {
    noneSrc:"../image/none.png",
    currentData: 0,
    allOrder:[
      
    ],
    hidden:true,
  },
  // 导航点击事件
  checkCurrent: function (e) {
    const that = this;
    var index = e.target.dataset.current;
    var allOrder = this.data.allOrder;
    if (that.data.currentData === e.target.dataset.current){
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
      if (index == 0) {
        status = '';
      } else if (index == 1) {
        status = 1;
      } else if (index == 2) {
        status = 2;
      } else if (index == 3) {
        status = 3;
      } else if (index == 4) {
        status = 4;
      }else if(index==5){
        status = 7;
      }
      list = [];
      getAllOrders(that);
    }
  },
  //获取当前滑块的index
  // bindchange: function (e) {
  //   const that = this;
  //   that.setData({
  //     currentData: e.detail.current
  //   })
  // },
  // 申请售后
  apply:function(){
    wx.navigateTo({
      url: '../applyAfter/applyAfter'
    })
  },
  // 查看物流
  seelogister:function(e){
    var index = e.currentTarget.dataset.index;
    var order_id = list[index].id;
    wx.setStorageSync("order_id", order_id);
    wx.navigateTo({
      url: '../logistics/logistics'
    })
  },
  // 点击查看详情
  orderDetails:function(e){
    var index=e.currentTarget.dataset.index;
    var order_id=list[index].id;
    wx.setStorageSync("order_id", order_id);
    wx.setStorageSync("orderInfo", orderInfo);
  
    wx.navigateTo({
      url: '../orderDetails/orderDetails'
    })
  },
  // 查看详情
  detailsClick:function(e){
    var index = e.currentTarget.dataset.index;
    var order_id = list[index].id;
    wx.setStorageSync("order_id", order_id);
    wx.setStorageSync("orderInfo", orderInfo);

    wx.navigateTo({
      url: '../orderDetails/orderDetails'
    })
  },
  onLoad:function(options){
    var that=this;
    // 调用
    // getAllOrders(that);
    var index=options.index;
   
    //[1=>'待付款',2=>'待发货',3=>'待收货',4=>'待评价',5=>'已完成',6=>'已取消',7=>'售后'];
    var num = parseInt(index) + 1;
    if(index==10){
      num=0;
      status = "";
    }else if(index==0){
      status=1
    }else if(index==1){
      status=2
    }else if(index==2){
      status=3
    }else if(index==3){
      status = 4
    }else if(index==4){
      status=7
    }
    
    that.setData({
      currentData:num
    })
  },
  onShow:function(){
    var that=this;
  
    list = [];
    getAllOrders(that);
  },
  // 取消事件
  clickCancel:function(e){
    var that=this;
    var index=e.currentTarget.dataset.index;
    var order_id=list[index].id;
    wx.showModal({
      content: '您是否确认取消此订单',
      success:function(res){
        if(res.cancel){
         
        }else if(res.confirm){
          cancelOrders(order_id, that);
        
        }
      }
    })
  },
  // 删除订单
  clickDelate:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var order_id = list[index].id;
    

    wx.showModal({
      content: '您是否确认删除此订单',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          delateOrders(order_id, that);
        }
      }
    })
  },
  // 确认收货
  clickConfirm:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var order_id = list[index].id;
 

    wx.showModal({
      content: '您已确认收货',
      success: function (res) {
        if (res.cancel) {

        } else if (res.confirm) {
          confirmOrders(order_id, that)
        }
      }
    })
  },
  // 提醒发货
  clickRemind:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var order_id = list[index].id;
    remindOrders(order_id, that);
  },
  // 付款
  clickPay:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    orderID = list[index].id;
    var payCode = list[index].pay_code;
    wx.showModal({
      title: '支付',
      content: '是否确认支付?',
      success:function(res){
        if (res.cancel) {

        } else if (res.confirm) {
          doPay(that,orderID,payCode);
        }
      }
    })
  },
  // 点击评价
  comment:function(e){
    var index = e.currentTarget.dataset.index;
    
    orderInfo = list[index]
    wx.setStorageSync("orderInfo", orderInfo);


    wx.navigateTo({
      url: '../comment/comment',
     
    })
  },
  // 上拉下拉刷新
  onReachBottom: function () {
    var that = this;
    if (!isLoading) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      getAllOrders(that,list.length);
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    if (!isLoading) {
      list = [];
      getAllOrders(that, 0);
    }
  }

})