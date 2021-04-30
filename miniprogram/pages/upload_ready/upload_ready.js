// miniprogram/pages/upload_ready/upload_ready.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileSource:'',
    passwordValue:'',
    downloadNumLimit:0,
    showTimeLimit:false,
    downloadDateLimit:0,
    showDateLimit:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fileSource:options.filePath
    })
    console.log('filesource'+this.fileSource)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  setTimeLimit(e){
    this.setData({
      showTimeLimit:e.detail
    })
  }


})