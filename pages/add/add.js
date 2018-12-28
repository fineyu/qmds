//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var arr=[];
var str2;
var flag;
function getAdress(that){
  var uid = wx.getStorageSync('userId');
  http.postReq("/api/get-addr-list", { uid: uid }, function (res) {
    var length = res.data.length;
    if (length == 0) {
      that.setData({
        show: false,
        tip: true,
      })
    } else {
      that.setData({
        show: true,
        tip: false,
      })
}

    arr = res.data;
    var newarr = [];
    for (var i = 0; i < arr.length; i++) {

      var ob = arr[i];
      var num = arr[i].is_default
      if (num == 1) {
        ob.checked = true;
      } else {
        ob.checked = false;
      }
      newarr[i] = ob;

    }
    that.setData({

      array: newarr,
    })

  })
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    index:'',
    qmSrc:"../image/qm.png",
    oneSrc:"../image/bianji.png",
    twoSrc:"../image/delate.png",
    array:[
           
    ],
  
  },
  // 点击事件
  radioChange: function (e) {
    var id = e.currentTarget.id
    var checked = this.data.array[id].checked
    var str = `array[${id}].checked`
    str2 = this.data.array[id].id
    // 选中切换
    if (checked == true) {
      this.setData({
        [str]: false
      })
      // return
    } else if (checked == false) {
      this.setData({
        [str]: true
      })
      // 选中其他不选中
      var arr = this.data.array;
      for (var i = 0; i < arr.length; i++) {
        if (id == i) {
          arr[i].checked = true;
        } else {
          arr[i].checked = false;
        }
      }
      this.setData({
        array: arr
      })
      
      http.postReq("/api/set-default-addr", { addr_id: str2 }, function (res) {  
      })
    }
  },
  // 删除
  delate:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    
    var id = arr[index].id;
    wx.showModal({
      title: '确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          http.postReq("/api/del-addr", { addr_id: id }, function (res) {
            var state=res.state;
            var msg=res.msg;
            if(state==true){
              getAdress(that);
            }else{
              wx.showToast({
                title: msg,
                icon:none,
                duration:2000,
              })
            }
            
          })           
        } else if (res.cancel) {
        }
      }
    })
  },
  // 编辑地址
  redact:function(e){
    // if(flag!=1){
    var index = e.currentTarget.dataset.index;
    var address=arr[index];
    wx.setStorageSync("addr", address);
    wx.navigateTo({
      url: '../newAdress/newAdress'
    })
    // }
  },
  // 添加新地址
  addNewAdress:function(){
    wx.navigateTo({
      url: '../newAdress/newAdress'
    })
  },
  // 判断是否有数据
  onLoad:function(options){
   
    flag=options.flag;
    
  },
  addressClick:function(e){
    var index = e.currentTarget.dataset.index;
    var address =arr[index];
    if(flag==1){
      wx.setStorageSync("addressInfo",address);
      wx.navigateBack({ 
      })
    }
    
  },onShow:function(){
    var that = this;
    getAdress(that);
  }
})