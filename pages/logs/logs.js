//logs.js
// const util = require('../../utils/util.js')
//获取应用实例
var http = require('../../service/http.js');

const app = getApp();
var phoneNum;
var goods_pro;
var web_url;
var discuss;
var scores=[];
var allprice;
var code;
var title;
var goods_id;
var uid;
var images=[];
//判断是否登录
function needLogin() {
  wx.showModal({
    content: "您还未登录请您先登录",
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
// 获取订单信息
function getOrderInfo(that){
    http.postReq("/order/wx-check-order", { uid: uid, goods_num: that.data.num, goods_id: goods_id, goods_pro_id: that.data.gg_id}, function (res) {
      if(res.state){
      
        wx.setStorageSync("orderInfo", res.data);
        wx.navigateTo({
          url: '../orderConfirmation/orderConfirmation',
        })
       
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration:2000,
        })
      }
    })
}

function getList(that) {
  http.postReq("/api/goods-detail", { goods_id: goods_id }, function (res) {
    console.log(res)
    var img_url = [];
    discuss=res.data.discuss;
    for(var i=0;i<discuss.length;i++){
      scores.push(discuss[i].level);
    }
    var desc = res.data.goods.desc;
    title = res.data.goods.title;
    var price = res.data.goods.price;
    var original_price = res.data.goods.original_price;
    var imgs = res.data.goods.img_url;
    var sale_num = res.data.goods.sale_num;
    phoneNum = res.data.goods.phone;
    var yunfei = res.data.goods.yunfei;
    web_url = res.data.goods.web_url;
    goods_pro = res.data.goods_pro;
    var img = imgs.split(",");
   

    const regex1 = new RegExp('style=""', 'g');
    const regex2 = new RegExp('<img', 'g');
    var xq = res.data.goods.detail.replace(regex1, '').replace(regex2, '<img style="max-width:100%;height:auto"');

    that.setData({
      title:title,
      desc: desc,
      price: price,
      original_price: original_price,
      img_url: img,
      sale_num: sale_num,
      yunfei: yunfei,
      goods_pro: goods_pro,
      discuss:discuss,
      scores:scores,
      myrich: xq
    });
  })
}

function showSelectUnit(that) {
  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  that.animation = animation
  animation.translateY(300).step()
  that.setData({
    animationData: animation.export(),
    showModalStatus: true,
    gg_title: goods_pro[0].title,
    gg_price: goods_pro[0].price,
    goods_img: goods_pro[0].img_url,
    gg_id: goods_pro[0].id,
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  }.bind(that), 200)
}

Page({
  data: {
    myrich:[{
      name: 'p',
      attrs: {
        // class: 'div_class',
        style: 'width:100%;'
      },
    },
      {
        name: 'img',
        attrs: {
          // class: 'div_class',
          style: 'width:100%;'
        },
      },
    ],
    qmSrc:"../image/qm.png",
    title:"",
    current: 1,
    desc: "",
    src: "../image/apple.jpg",
    price: "",
    original_price: "",
    buy: "立即购买",
    phone: "打电话",
    num: "1",
    sale_num: "",
    yunfei: "",
    all: "0",
    minusStatus: 'disabled',
    id: "6",
    right: "../image/right.png",
    phoneSrc: "../image/dadianhua.png",
    tipSrc: "../image/choose.png",
    // isshow:false,
    img_url: [

    ],
    web_url: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showModalStatus: false,//是否显示
    gg_id: 100,//规格ID
    gg_title: '',//规格文本
    gg_price: 0,//规格价格
    goods_img: "",
    goods_pro: '',
    goods_pro: [],
    num: 1,//
    imghref: "../image/apple.jpg",
    yunfei:"",
    // 评价
    evaluate_contant: [' '],
    stars: [0, 1, 2, 3, 4],
    // level:5,
    normalSrc: '../image/star-off.png',
    selectedSrc: '../image/star-on.png',
    halfSrc: '../image/bankexingxing.png',
    score: 5,
    scores:"",
    discuss:'',
  },
  // 拨打电话
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: phoneNum,
    })
  },
  chooseGg: function () {
    var that = this;
    showSelectUnit(that);
  },
  // 购买
  buy: function () {
    var that = this;
    showSelectUnit(that);
  },
  // 点击评价详情
  comment: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (that.data.current == id) {
      // return 
    } else {
      that.setData({
        current: id,
      })
    }
    // wx.setStorageSync("web_url", web_url);
    // wx.navigateTo({
    //   url:"../detailsCon/detailsCon",
    // })
  },
  // 点击评价
  datails:function(e){
    var that = this;
    var id = e.currentTarget.id;
    if (that.data.current == id) {
      // return 
    } else {
      that.setData({
        current: id,
      })
    }
  },
  //规格选择
  filter: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.txt;
    var price = e.currentTarget.dataset.price;
    var img_url = e.currentTarget.dataset.img_url;
    that.setData({
      gg_id: id,
      gg_title: title,
      gg_price: price,
      goods_img: img_url,
    });
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  //隐藏对话框
  hideModal: function(){
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 立即购买
  buttonBuy: function () {
    var that=this;
    uid = wx.getStorageSync('userId');
    if (uid == "") {
      needLogin();
    } else {
      getOrderInfo(that)
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0,
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
    }
    
  
    // wx.navigateTo({
    //   url: '../orderConfirmation/orderConfirmation'
    // })
  },
 
  // 分享
  onShareAppMessage: function (options) {
    var shareObj = {
      title: title, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index?goods_id=' + goods_id, // 默认是当前页面，必须是以‘/’开头的完整路径
    }
    return shareObj;
  },
  
  onLoad: function (options) {
    var that=this;
    goods_id = options.goods_id;
    if (goods_id==null){
      goods_id = wx.getStorageSync("goods_id");
    }
    getList(that);
  },
  onShow:function(){
    var that = this;
    that.setData({
      current: 1,
    })
  },
  
})
