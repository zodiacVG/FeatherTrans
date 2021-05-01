// miniprogram/pages/upload_ready/upload_ready.js
const db=wx.cloud.database()
const todos=db.collection('files')
var _this=null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileSource:'',
    fileType:'',
    passwordValue:'',
    downloadNumLimit:0,
    showTimeLimit:false,
    downloadDateLimit:7,
    showDateLimit:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this
    this.setData({
      fileSource:options.filePath,
      fileType:options.fileType
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
  },

  setPasswordShow(e){
    this.setData({
      showPasswordInput:e.detail
    })
  },

  setDateShow(e){
    this.setData({
      showDateLimit:e.detail
    })
  },

  doUploadToCloud(){
    console.log('调用了上传的函数')
    const cloudPath = `my-imagesxxxxxxxxxxx`
    wx.cloud.uploadFile({
      cloudPath:cloudPath,
      filePath:_this.data.fileSource,
      success: res => {
        todos.add({
          data:{
            fileID:res.fileID,
            uploadDate:Date.now(),
            dowmloadPassword:_this.data.passwordValue,
            downloadDateLimit:_this.data.downloadDateLimit,
            downloadNumLimit:_this.data.downloadNumLimit,
            success: res => {
              console.log(res)
            },
            fail: e => {
              console.log(e)
            }
          }
        })
        console.log('[上传文件] 成功：', res)
        console.log('filepath'+fileSource)
        console.log('fileType'+fileType)
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

})