// pages/drawback/drawback.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var imgCounts = 0;
var imgsList = [];
var imgStr = '';
var order_id;

// 售后原因
function getReason(that) {
  http.getReq("/order/reason", function (res) {
    if (res.state) {
      that.setData({
        reasons: res.data
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
// 申请售后
function afterSales(order_id, reason, type, name, desc, img_url, phone) {
  http.postReq("/order/after-order", { order_id: order_id, reason: reason, type: 2, name: name, desc: desc, img_url: img_url, phone: phone }, function (res) {
    if (res.state) {
    } else {
      wx.showToast({
        title: res.msg,
        icon: "none",
        duration: 2000,
      })
    }

  })
}


// 图片评价上传
function uploadingPicture(img) {
  wx.showLoading({
    title: '正在上传...',
  })
  wx.uploadFile({
    url: 'https://qmds.jsdianshi.com/order/upload-img',
    filePath: img,
    content: '',
    name: 'img',
    formData: {
      "uid": ""
    },
    success: function (res) {
      var dataRes = res.data;
      wx.hideLoading();

      imgStr += JSON.parse(dataRes).data + ",";
    }
  })


}



// 显示遮罩层
function showSelectUnit(that) {
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
  })
  setTimeout(function () {
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  }.bind(that), 300)
}
Page({
  data: {
    src: '',
    proName: "",
    price: "",
    num: "",
    allprice: "",
    chooseSrc: "../image/phone1.png",
    imgs: [],
    reason: "",
    comment: "",
    name: "",
    phone: "",
    reasons: [],
    value: "商品质量问题",
    showModalStatus: false,
  },

  // 触发选择退款
  chooseReason: function () {
    var that = this;
    showSelectUnit(that)
  },

  // 选择图片上传
  choosePicture: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgs: tempFilePaths,
        })
        imgCounts++;

        var imgs = that.data.imgs;
        for (let i = 0; i < imgs.length; i++) {
          uploadingPicture(imgs[i])
        }


      }
    })


  },
  // 获取手机号
  getPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取姓名
  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取评论
  getComment: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 提交
  submit: function () {
    let _this = this;
    var reason = _this.data.reason;
    var name = _this.data.name;

    var phone = _this.data.phone;
    var desc = _this.data.comment;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;

    if (name == "") {
      wx.showToast({
        title: '您还没写姓名',
        icon: "none",
        duration: 2000,
      })
      return false;
    } else if (phone == "") {
      wx.showToast({
        title: '您还没写电话',
        icon: "none",
        duration: 2000,
      })
      return false;
    } else if (!myreg.test(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 3000
      })
      return false;
    } else if (desc == "") {
      wx.showToast({
        title: '您还没描述产品',
        icon: "none",
        duration: 2000,
      })
      return false;
    } else if (reason == "") {
      wx.showToast({
        title: '您还没选择退款原因',
        icon: "none",
        duration: 2000,
      })

      return false;
    } else {



      afterSales(order_id, reason, 2, name, desc, imgStr, phone);
      wx.navigateTo({
        url: '../returnDetails/returnDetails?order_id=' + order_id
      });

    }
  },

  onLoad: function () {

  },
  onShow: function () {
    var that = this;
    var orderInfo = wx.getStorageSync("orderInfo");
    order_id = orderInfo.goods[0].order_id;
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
    getReason(that);
  },

  //隐藏对话框
  hideModal: function () {
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

  // 取消
  cancelClick: function () {
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


  // 确定
  confirmClick: function () {
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


  // 选择原因并赋值
  bindChange: function (e) {
    var index = e.detail.value[0];
    var reason = this.data.reasons[index];
    this.setData({
      reason: reason,
    })
  }
})