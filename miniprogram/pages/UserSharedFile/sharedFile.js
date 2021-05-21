// miniprogram/pages/sharedFile/sharedFile.js
const db = wx.cloud.database()
var _this = null
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    userQuestionList: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.setData({
      // userID: app.globalData.openID // 理论上一开始打开第一个页面就有了但是我们现在要先调试一下先
      userID: "oVM9D5RLJMu8C13EMPD5NsWDRfR4"
    })

    db.collection('userInfo').where({
      _openid: this.data.userID
    })
    .get({
      success: function(res) {
        this.setData({
          userInfo: res.data[0]._userInfo
        })
      }
    })
    db.collection('question_files').where({
      _openid: this.data.userID
    })
    .get({
      success: function(res) {
        _this.setData({
          userQuestionList: res.data
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data)
  },

  toFileAccessUsers: function(event){
    var idx = event.target.dataset.idx
    wx.navigateTo({
      url: '../fileAccessUsers/fileAccessUsers?fileID='+this.data.userQuestionList[idx]._id+'&userInfo='+this.data.userID
    })
  }
})