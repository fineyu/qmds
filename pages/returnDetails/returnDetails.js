// pages/refundDetails/refundDetails.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var order_id;
var typeNum;
// 退款退货详情
function afterSales(order_id,that) {
  http.postReq("/order/deal-after", { order_id: order_id }, function (res) {
    typeNum=res.data.frist.type;
    if (typeNum==1){

    }else{
      wx.setNavigationBarTitle({
        title: '退款退货详情'
      });
      that.setData({
        hidden:false
      })
    }

    if (res.state) {
      that.setData({
        state:res.data.status_name,
        final:res.data.frist.add_time,
        backname:res.data.frist.name,
        reason:res.data.frist.reason,
        backphone:res.data.frist.phone,
        desc:res.data.frist.desc,
        array:res.data.list,
        imgs: res.data.frist.img_url,
        reasontitle: res.data.frist.type_name,
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      })
    }

  })
}




Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden:"true",
    reasontitle:"",
    desc:"",
    src: '',
    proName: "",
    price: "",
    num: "",
    allprice: "",
    reason: "",
    topsrc: '../image/tuikuanbeijing.png',
    state: "",
    final: "",
    backway:"退回钱包",
    backname:"",
    backphone:"",
    array: [],
    imgs:[],
  },
  onLoad: function (options) {
    var that = this;
    var orderInfo = wx.getStorageSync("orderInfo");
    // 运费
    var yunfei = orderInfo.yunfei;
    // 总价
    var money = orderInfo.money;
    that.setData({
      allprice: (money - yunfei) + ".00",
      src: orderInfo.goods[0].img_url,
      proName: orderInfo.goods[0].goods_name,
      price: orderInfo.goods[0].price,
      num: orderInfo.goods[0].goods_num,
    })
    order_id = options.order_id;
    afterSales(order_id,that);
  },
  // 填写物流信息
  logistics:function(){
    wx.navigateTo({
      url: '../writeLogistics/writeLogistics?order_id='+order_id,
    })
  },
  previewImage:function(e){
    console.log(e)
    var current=e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls:this.data.imgs,
    })
  }
})