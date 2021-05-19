// miniprogram/pages/fileAccessUsers/fileAccessUsers.js
const db = wx.cloud.database()
var _this = null
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    fileID: '',
    userInfo: {},
    accessUsersList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.setData({
      userID: options.userInfo,
      fileID: options.fileID
    })
    db.collection('userInfo').where({
      _openid: this.data.userID
    })
    .get({
      success: function(res) {
        _this.setData({
          userInfo: res.data[0]._userInfo
        })
      }
    })
    db.collection('question_files').where({
      _id: this.data.fileID
    })
    .get({
      success: function(res) {
        _this.setData({
          accessUsersList: res.data[0].accessUsersList
        })
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