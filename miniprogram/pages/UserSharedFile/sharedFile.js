// miniprogram/pages/sharedFile/sharedFile.js
const db = wx.cloud.database()
const question_files = db.collection('question_files')
var _this = null
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // userID: app.globalData.openID // 理论上一开始打开第一个页面就有了但是我们现在要先调试一下先
      userID: "oVM9D5RLJMu8C13EMPD5NsWDRfR4"
    })
    db.collection('question_files').where({
      _openid: 'user-open-id',
      done: false
    })
    .get({
      success: function(res) {
        // res.data 是包含以上定义的两条记录的数组
        console.log(res.data)
      }
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})