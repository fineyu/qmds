// pages/newAdress/newAdress.js
var tcity = require("../../utils/adress.js");
//获取应用实例
var http = require('../../service/http.js');
const app = getApp();
var addrId='';

function getCity(that){
  wx.showLoading({
    title: '加载中',
  })
  // var that = this;
  tcity.init(that);
  var cityData = that.data.cityData;
  var provinces = [];
  var citys = [];
  var countys = [];

  var provincescode=[];
  var cityscode = [];
  var countyscode = [];

  for (let i = 0; i < cityData.length; i++) {
    // 循环获取省的数组
    provinces.push(cityData[i].name);
    // 循环获取省的code的数组
    provincescode.push(cityData[i].code);
  }
 
  for (let i = 0; i < cityData[0].sub.length; i++) {
    //市不变 循环获取市的数组
    citys.push(cityData[0].sub[i].name);
    //市不变 循环获取市code的数组
    cityscode.push(cityData[0].sub[i].code);
  }


  for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
    // 省市不变,获取区域的数组
    countys.push(cityData[0].sub[0].sub[i].name);
    // 省市不变,获取区域code的数组
    countyscode.push(cityData[0].sub[0].sub[i].code);
  }
  if(that.data.citycode!=""){
    that.setData({
      'provinces': provinces,
      'provincescode': provincescode,
      'cityscode': cityscode,
      'countyscode': countyscode,
      'citys': citys,
      'countys': countys,
    })
  }else{
    that.setData({
      'provinces': provinces,
      'provincescode': provincescode,
      'cityscode': cityscode,
      'countyscode': countyscode,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name,
      'provincecode': cityData[0].code,
      'citycode': cityData[0].sub[0].code,
      'countycode': cityData[0].sub[0].sub[0].code,
    })
  }
  wx.hideLoading();
 
};

Page({
  data: {
    adressDetails:'',
    name:'',
    phone:'',
    provinces: [],
    provincescode: [],
    province: "",
    citys: [],
    cityscode: [],
    city: "",
    countys: [],
    countyscode: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    provincecode:'',
    citycode:'',
    countycode:'',
    addr_id:'',
  },

  // 三级联动
  bindChange: function (e) {
   
    var val = e.detail.value;
    var t = this.data.values;
    var cityData = this.data.cityData;
    var citycode = this.data.citycode;
    var countycode = this.data.countycode;
    if (val[0] != t[0]) {
      // 省不变动
      
      var citys = [];
      var countys = [];
      var cityscode = [];
      var countyscode = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
        cityscode.push(cityData[val[0]].sub[i].code)
      
      }
      
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name);
        countyscode.push(cityData[val[0]].sub[0].sub[i].code);
      }
    
      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
        provincecode: this.data.provincescode[val[0]],
        citycode: cityData[val[0]].sub[0].code,
        countycode: cityData[val[0]].sub[0].sub[0].code,
      })
     
      return;
    }
    if (val[1] != t[1]) {
     
      const countys = [];
      const countyscode = [];
      var citycode = this.data.citycode;
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name);
        countyscode.push(cityData[val[0]].sub[val[1]].sub[i].code);
      };
      
      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0],
        citycode: cityData[val[0]].sub[val[1]].code,
        countycode: cityData[val[0]].sub[val[1]].sub[0].code,
      })  
      return;
    }
    if (val[2] != t[2]) {
      
      this.setData({
        county: this.data.countys[val[2]],
        countycode: cityData[val[0]].sub[val[1]].sub[val[2]].code,
        values: val,
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  // 获取姓名
  getUserName:function(e){
    var name=e.detail.value;
    this.setData({
      name:name,
    })
  },
  // 获取手机
  getUserPhone: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone,
    })
  },
  // 获取地址
  getUserAddr:function(e){
    var add = e.detail.value;
    this.setData({
      adressDetails: add,
    })

  },
  
  finish:function(){
    var that = this;
    var provincecode = that.data.provincecode;
    var citycode = that.data.citycode;
    var countycode = that.data.countycode;
    var uid = wx.getStorageSync('userId');
    var name = that.data.name;
    var phone = that.data.phone;
    var addr = that.data.adressDetails;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;

    if(name == ''){
      wx.showToast({
        title: '您的姓名没有填写',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (phone == '') {
      wx.showToast({
        title: '您的手机号没有填写',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (addr == '') {
      wx.showToast({
        title: '您的详细地址没有填写',
        icon: 'none',
        duration: 3000                                                        
      })
      return;
    }
    
    http.postReq("/api/set-addr", { uid: uid, province: provincecode, city: citycode, district: countycode, name: name, phone: phone, addr: addr, addr_id: addrId }, function (res) {
     
      if(res.state){
        wx.showToast({
          title: '保存成功',
          duration:2000,
        })
        wx.navigateBack({
          
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration:2000,
        })
      }
    })
   

  },
  onLoad:function(){
    var that = this;
    addrId="";
    // 所在地
    var uid = wx.getStorageSync('userId');
    var addr = wx.getStorageSync("addr");
    // 判断修改标题
    if (addr !=""){
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
      var uid = wx.getStorageSync('userId');
      var provincecode = addr.province;
      var citycode = addr.city;
      var countycode = addr.district;
      var name = addr.name;
      var phone = addr.phone;
      var address = addr.addr;
      var adressName = addr.ssq;
      addrId = addr.id;
      that.setData({
        name: name,
        phone: phone,
        provincecode: provincecode,
        citycode: citycode,
        countycode: countycode,
        adressDetails: address,
        province: adressName,
        city: " ",
        county: " ",
      })
      wx.setStorageSync("addr", "");
    };
    getCity(that)
  },
 
})