// 会员页面
Page({
  data:{
    car: "../image/banner.png",
    title:"优享会员",
    lis:[
      { month: "月度会员", price: "5" },
      { month: "季度会员", price: "12" },
      { month: "半年会员", price: "18" },
    ],
    currentTab: 0,
    price:5,
  },
  click: function (e) {
    var lis=this.data.lis
    var index = e.currentTarget.dataset.index
    this.setData({
      currentTab: index
    });
    console.log()
    var price = this.data.price
    this.setData({
        price: lis[index].price
    });
  },

})