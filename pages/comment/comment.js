// pages/comment/comment.js
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var order_id;
var imgsList = [];
var order_goods_id;
var imgCounts = 0;

// 上传评价
function pushComment(that) {
  
  var comment = that.data.comment;
  if (comment == '') {
    wx.showToast({
      title: '您还没写体验',
      icon:"none",
      duration: 3000,
    })
    return false;
  }
  var level = that.data.score;
  var uid = wx.getStorageSync('userId');
  http.postReq("/order/discuss", {
    order_id: order_id,
    img_url: imgsList,
    content: comment,
    level: level,
    order_goods_id: order_goods_id,
    uid: uid
  }, function(res) {
    var msg=res.msg;
 
    if (res.state == true) {
      wx.navigateBack({
        delta:1,
      })
    }else{
      wx.showToast({
        title: msg,
        icon:"none",
        duration:2000,
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
    url: 'http://qmds.jsdianshi.com/order/upload-img',
    filePath: img,
    content: '',
    name: 'img',
    formData: {
      "uid": ""
    },
    success: function(res) {
     
      var dataRes = res.data;
   
      wx.hideLoading();
      imgsList.push(JSON.parse(dataRes).data)
    }
  })
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    evaluate_contant: [' '],
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../image/star-off.png',
    selectedSrc: '../image/star-on.png',
    halfSrc: '../image/bankexingxing.png',
    score: 5,
    scores: [5, 5, 5],

    chooseSrc: "../image/phone1.png",
    imgs: [],
    // flag2: 5,
    src: "../image/apple.jpg",
    name: "大苹果",
    comment:'',
  },
  comment:function(e){
    var that=this;
   
    that.setData({
      comment: e.detail.value
    })
  },

  //点击左边,半颗星
  selectLeft: function(e) {
    var score = e.currentTarget.dataset.score
    if (this.data.score == 0.5 && e.currentTarget.dataset.score == 0.5) {
      score = 0;
    }

    this.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
        scores: this.data.scores,
        score: score
      })

  },

  //点击右边,整颗星
  selectRight: function(e) {
    var score = e.currentTarget.dataset.score

    this.data.scores[e.currentTarget.dataset.idx] = score,
      this.setData({
        scores: this.data.scores,
        score: score
      })
  },

  // 选择图片上传
  choosePicture: function() {

    var that = this;
    wx.chooseImage({
      count: 3, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
       
        var tempFilePaths = res.tempFilePaths;
       
        that.setData({
          imgs: tempFilePaths,

        })
        imgCounts++;
      
        if (imgCounts == imgsList.length) {

          pushComment(that);
        }

      }
    })
  },
  onLoad: function() {
    var that = this;
    var orderInfo = wx.getStorageSync("orderInfo");
    order_id = orderInfo.id;
    var goods_name = orderInfo.goods[0].goods_name;
    var img_url = orderInfo.goods[0].img_url;
    order_goods_id = orderInfo.goods[0].id;
    that.setData({
      src: img_url,
      name: goods_name,
    })
  },
  // 发布
  upload: function() {
    var that = this;
    if (imgsList.length == 0) {
      pushComment(that);
    } else {
      var imgs = that.data.imgs
      for (var i = 0; i < imgs.length; i++) {
        uploadingPicture(imgs[i])
      }
    }
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imgs,
    })
  }
})