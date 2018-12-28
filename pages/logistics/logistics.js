// pages/logistics/logistics.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();


// 查看物流
function checkLogister(order_id,that) {
  http.postReq("/order/express", { order_id: order_id, type: 1}, function (res) {
   
    var array = res.data.list;
    that.setData({
      array: array.reverse(),
    })
  })
}

Page({
  data: {
    src: '../image/apple.jpg',
    proName: "大苹果",
    express: "申通快递",
    num: "123456789",
    time:"2018-09-12 6:00",
    rate:"卖家已发货",
    array:[
      
    ],
  },
  onLoad:function(){
    var that=this;
    var order_id = wx.getStorageSync("order_id");
    checkLogister(order_id,that);
  }
})