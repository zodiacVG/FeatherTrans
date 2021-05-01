// miniprogram/pages/shareOpenPage/shareOpenPage.js
const db=wx.cloud.database()
const todos=db.collection('files')
var _this=null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this
    this.setData({
      fileID:options.fileID
    })
    todos.doc(this.data.fileID).get({
      success:(res)=>{
        console.log('数据库里查到的数据'+res)
      }
    })
    this.setData({
      fileID:options.fileID
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