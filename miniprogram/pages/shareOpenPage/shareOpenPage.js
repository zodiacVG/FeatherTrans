// miniprogram/pages/shareOpenPage/shareOpenPage.js
const db=wx.cloud.database()
const todos=db.collection('files')
var _this=null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID:'',
    filePath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this
    this.onGetOpenid()
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

  downloadSharedFile(){
  wx.cloud.downloadFile({
    fileID:this.data.fileID,
    success:res => {
      this.setData({
        filePath:res.tempFilePath
      })
    },
    fail(res){
      wx.showToast({
        title: '下载文件失败了',
        duration: 5000,
      })
    }
  })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log(app.globalData)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})