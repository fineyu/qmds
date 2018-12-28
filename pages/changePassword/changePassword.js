//获取应用实例
var http = require('../../service/http.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    src:"../image/lock.png",
    isShowPassword: true,
    open:"../image/open.png",
    close:"../image/close.png",
    newpwd:"",
    oldpwd:"",
  },

  toggleShowPassword: function (e) {
    var isShowPassword = !this.data.isShowPassword;
    this.setData({
      isShowPassword: isShowPassword
    });
  },
  // 点击原密码
  oldPwd:function(e){
    var that=this;
    var oldpwd=e.detail.value;
    this.setData({
      oldpwd: oldpwd,
    })

  },
  // 点击新密码
  newPwd:function(e){
    var that = this;
    var newpwd = e.detail.value;
    this.setData({
      newpwd: newpwd,
    })
  },
  // 提交
  submit:function(){
    var uid = wx.getStorageSync('userId');
    var password = this.data.oldpwd;
    var new_password = this.data.newpwd;
    http.postReq("/api/edit-password", { uid: uid, password: password, new_password: new_password }, function (res) {
      if(res.state==true){
        wx.showToast({
          title: '修改成功',
          icon:"none",
          duration:2000,
        });
        wx.redirectTo({
          url: "../change/change",
        });
      }else{
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000,
        });
      }
    })
  }
})