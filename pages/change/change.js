//获取应用实例
var http = require('../../service/http.js');
const app = getApp();

// 用户信息的方法
function getUserNews(uid, that) {
  http.postReq("/api/user-info", { uid: uid }, function (res) {
    
    that.setData({
      header: res.data.head_pic,
      nickName: res.data.nickname,
      sign: res.data.sign,
    })
  })
}

// 修改信息
Page({
  data: {
    versions:"",
    sign: '',
    nickName: ' ',
    header: "../image/qm_header.png",
    // imgUrl: null,
    right: "../image/right.png"
  },
  onLoad: function () {
    var uid = wx.getStorageSync('userId');
    var that = this;
    getUserNews(uid, that);
  },
  // 点击关于我们
  about: function () {
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
    })
  },
  // 修改密码
  changePassword: function () {
    wx.navigateTo({
      url: '../changePassword/changePassword',
    })
  },

  // 点击头像修改图片
  gotoShow: function () {
    var _this = this;
    var header = _this.data.head_pic;
    var uid = wx.getStorageSync('userId');
    // userInfo = wx.getStorageSync('userInfo')
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
     
        wx.uploadFile({
          url: 'http://qmds.jsdianshi.com/api/upload-pic',
          filePath: tempFilePaths[0],
          name: 'head_pic',
          formData: {
            "uid": uid,
          },
          success: function (res) {
            getUserNews(uid, _this);
          
            _this.setData({
              header: tempFilePaths
            });
          }
        })
        if(res.state==true){
          wx.showToast({
            title: '头像修改成功',
            icon:"none",
            duration:2000,
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000,
          })
        }
        wx.setStorageSync("header", tempFilePaths)
      }
    })
  },

  // 点击修改姓名
  nameInput: function (e) {
    var _this = this;
    var uid = wx.getStorageSync('userId');
    var nickName = _this.data.nickName;
    var name = e.detail.value;
    http.postReq("/api/set-nick-name", { uid: uid, nickname: name }, function (res){
     
      _this.setData({
        nickName: name,
      });
      if (res.state == true) {
        wx.showToast({
          title: '姓名修改成功',
          icon: "none",
          duration: 2000,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000,
        })
      }
    });
   
    wx.setStorageSync("nickName", name);
  },
  // 点击修改个签
  signInput: function (e) {
    var _this = this;
    var uid = wx.getStorageSync('userId');
    var sign = _this.data.sign;
    var sign = e.detail.value;
    http.postReq("/api/set-sign", { uid: uid, sign: sign }, function (res) {
   
      _this.setData({
        sign: sign,
      });
      if (res.state == true) {
        wx.showToast({
          title: '个签修改成功',
          icon: "none",
          duration: 2000,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000,
        })
      }
    });
    
    wx.setStorageSync("sign", sign)
  },
  // 保存
  save: function () {
    // 跳转到我的主页
    wx.showModal({
      title: '退出登录',
      content: '确认登出登录吗',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("userId", "");          
            wx.switchTab({
              url: '../mine/mine' //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else if (res.cancel) {
        }
      }
    })
  },
  onShow:function(){
    var info = wx.getSystemInfoSync();
    this.setData({
      versions: info.SDKVersion
    })
  }
})