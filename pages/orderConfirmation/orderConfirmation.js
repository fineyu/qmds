var http = require('../../service/http.js');
const app = getApp();

var code;
var order;
var uid;
var mark;
var package1;
var paySign;
var timeStamp;
var nonce;
var ispay=false;
// 获取订单信息
function getOrderInfo(that){
  order = wx.getStorageSync('orderInfo');
  
  // 判断addr是否为空，为空则点击跳转到添加地址页面
  if (order.addr.addr == "" || order.addr.addr==null){
      that.setData({
        current:1,
      })
    }else{
      that.setData({
        current: 0,
      })
    }
  that.setData({
    addrId: order.addr.id,
    name: order.addr.name,
    phone: order.addr.phone,
    addr: order.addr.addr,
    gys_name: order.result.gys_name,
    goods_name: order.result.goods_name,
    price: order.result.price,
    goods_num: order.result.goods_num,
    img_url: order.result.img_url,
    rightSrc: "../image/right.png",
    zfSrc: "../image/zffs.png",
    wxSrc: "../image/weixin.png",
    chooseSrc: "../image/choose.png",
    allPrice: order.result.total_price,
    gys_img_url: order.result.gys_head_pic ,
    yunfei: order.result.yunfei,
  })
}

function getWeixinInfo(addrId){
  http.postReq("/order/wx-gener-order", { goods_pro_id: order.result.goods_pro_id, goods_num: order.result.goods_num, uid: uid, addr_id: addrId, mark: mark, openid: app.globalData.openid}, function (res) {
   
      if (res.code == 400 && res.code) {
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration:2000
        })
      }else{
      paySign = res.paySign;
      timeStamp = String(res.timeStamp);
    var nonc= res.nonceStr+"";
      var order_id=res.order_id;
      ispay=true;
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonc,
        'package': res.package+"",
        'signType': 'MD5',
        'paySign': paySign+"",
        'success': function (res) {
          wx.setStorageSync("order_id", order_id);
          wx.redirectTo({
            url: '../orderDetails/orderDetails'
          })
        },
        'fail': function (res) {
          wx.showToast({
            title: '支付失败',
            icon:'none',
            duration:3000,
          })
          wx.setStorageSync("order_id", order_id);
          wx.redirectTo({
            url: '../orderDetails/orderDetails'
          })
        }
      })
      }
    
  })
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    yunfei: "",
    gys_img_url: '',
    addrId:"",
    current:0,
    dizhiSrc:"../image/dizhi.png",
    name:"",
    phone:"",
    addr:"",
    gys_name:"",
    wpay:"",
    goods_name:"",
    price:"",
    goods_num:"",
    img_url:"",
    rightSrc:"../image/right.png",
    zfSrc:"../image/zffs.png",
    wxSrc:"../image/weixin.png",
    chooseSrc:"../image/choose.png",
    allPrice:"199.00"
  },
  rightClick:function(){
    wx.navigateTo({
      url: '../add/add?flag=1',
    })
  },
  liuyan:function(e){
      mark=e.detail.value;
  },
  onLoad:function(options){
    uid = wx.getStorageSync('userId');
    getOrderInfo(this)
  },
  goBuy:function(){
    var addrid=this.data.addrId;
  
    if(addrid==""){
      wx.showToast({
        title: '请选择收货地址',
        icon:'none',
        duration:3000,
      })
    }else{
      getWeixinInfo(addrid);
    }
    
  },
  // 添加地址
  addadress:function(e){
    if (order.addr.addr==""){
      wx.navigateTo({
        url: '../add/add?flag=' + 1,
      })
    }
  },
  onShow:function(){
    var addressInfo = wx.getStorageSync("addressInfo");
    
  
    if (addressInfo != null && addressInfo != "") {
     
      wx.setStorageSync("addressInfo", null);
      this.setData({
        addrId: addressInfo.id,
        name: addressInfo.name,
        phone: addressInfo.phone,
        addr: addressInfo.addr_name,
      })

    } else {
      
    }
  }

})