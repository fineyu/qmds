var http = require('../../service/http.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: "../image/qm_header.png",
    index: 1,
    active: 0,
    phone: '',//手机号
    code: '',//验证码
    codename: '获取验证码',
    makePassword: '',
    dianhua: "../image/dadianhua.png",
    yanzhengma: "../image/yanzhengma.png"
  },
  //获取input输入框的值
  getPasswordValue: function (e) {
    this.setData({
      password: e.detail.value,
      index: 0,
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value,
      index: 0,
    })
  },
 

  getCode: function () {
    var phone = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {

      http.postReq("/api/send-sms", { phone: phone }, function (res) {
        
        var state = res.state;
        var msg = res.msg;
        if (state == true) {
          wx.showToast({
            title: '验证码发送成功',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: msg,
            duration: 2000
          })
        }

        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })

          } else {
            _this.setData({
              codename: num + "s"
            })
          }
        }, 1000)
      })
    }
  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  //提交表单信息
  submit: function () {
   
    var phone = this.data.phone;
    var password = this.data.password;
    var code = this.data.code;
    var makePassword = this.data.makePassword;

    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 3000
      })
      return false;
    };
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
    };
    if (code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 3000
      })
      return false;
    };
   
    
  },

})
