var http = require('../../service/http.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bg1Src:"../image/back1.png",
    bg2Src:"../image/back2.png",
    bg3Src:"../image/back3.png",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weixin:"../image/weixin.png",
    src:"../image/qm_header.png",
    active:0,
    index:1,
    password: '',//姓名
    phone: '',//手机号
    dianhua:"../image/dadianhua.png",
    mima:"../image/mima.png",
  },
  //获取input输入框的值
  getPasswordValue: function (e) {
    this.setData({
      password: e.detail.value,
      index:0,
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value,
      index: 0,
    })
  },
  register:function(){
    wx.redirectTo({
      url: '../register/register',
    })
  },
  // 登录保存
  login: function () {
    var phone = this.data.phone;
    var password = this.data.password;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    // 手机
    if (phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 3000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 3000
      })
      return false;
    }
    // 密码
    if (password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 3000
      })
      return false;
    }

    http.postReq("/api/login", { phone: phone, password: password }, function(res){
      var msg = res.msg;
      var state=res.state;
      if(state==true){
      
        wx.setStorageSync('userId', res.data.id)
        wx.navigateBack({
          
        })
      }else{
        wx.showToast({
          title: msg,
          icon:"none",
          duration:3000,
        })
      }
    })
    
  },
  // 忘记密码
  forgetPwd: function(){
    wx.navigateTo({
      url: '../forgetPassword/forgetPassword',
    })
  },
  onLoad:function(){
      var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  // 微信授权登录
  
  bindGetUserInfo:function(e){
    
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.login({
        success: res => {
          var that = this;
          // ------ 获取凭证 ------
          var code = res.code;
        
          // getOpenId(code)
          if (res.code) {
            //发起网络请
            http.postReq("/api/wx-login", {code: code}, function (res) {
              
              if (res.state) {
                  if(res.data.type==1){
                    wx.setStorageSync("userId", res.data.uid);
                    wx.navigateBack({
                      
                    })
                    wx.showToast({
                      title: "微信登陆成功",
                      icon: "none",
                      duration: 3000,
                    })
                  }
              } else {
                wx.showToast({
                  title:res.msg,
                  icon: "none",
                  duration: 3000,
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
      //授权成功后，跳转进入小程序首页
      // wx.switchTab({
      //   url: ''
      // })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})
