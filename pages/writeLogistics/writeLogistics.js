//获取应用实例
var http = require('../../service/http.js');
const app = getApp();

// 放物流公司
var companys=[];
// 放简称
var nos=[];
var order_id;

// 获取公司
function getCompany(that){
  http.getReq("/order/all-express", function (res) {
    var datas=res.data;
    for (var i = 0; i < datas.length;i++){
        companys.push(datas[i].com);
        nos.push(datas[i].no)
    }
    if (res.state) {
      that.setData({
        coms: companys
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

// 保存提交
function saveLogistics(order_id, com, express){
  http.postReq("/order/return-money", { order_id:order_id,com:com, express:express}, function (res) {
      if(res.state){

      }else{
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000,
        })
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
    tuihuo:"../image/huoche.png",
    right:"../image/right.png",
    company:"",
    coms:[],
    nos:[],
    no:"",
    value:"",
  },
  choose:function(){
    var that = this;
    showSelectUnit(that)
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
    var coms = this.data.coms[index];
    var no=nos[index];
    this.setData({
      company: coms,
      no:no,
    })
  },
  onLoad:function(options){
    order_id=options.order_id;
    var that=this;
    getCompany(that);
  },
  writeNum:function(e){
    this.setData({
      value:e.detail.value
    })
  },
  // 提交
  submit:function(){
    var express=this.data.value;
    var no=this.data.no;
    if(this.data.company==""){
      wx.showToast({
        title: '您还没有选择物流公司',
        icon:"none",
        duration:2000,
      })
    }else if(this.data.value==""){
      wx.showToast({
        title: '您还没有填写物流单号',
        icon: "none",
        duration: 2000,
      })
    }else{
      saveLogistics(order_id, no, express)
      wx.navigateBack({
        
      })
    }
  }
})