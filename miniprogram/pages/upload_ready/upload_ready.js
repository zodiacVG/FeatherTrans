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
    downloadNumLimit:-1, //-1代表没有次数限制
    showTimeLimit:false, //
    downloadDateLimit:7, //默认下载期限是7天
    showDateLimit:false,
    fileID:'' //云数据库里的文件id
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
    const cloudPath = `my-images`+Date.now()+getApp().globalData.openid
    wx.cloud.uploadFile({
      cloudPath:cloudPath,
      filePath:_this.data.fileSource,
      success: res => {
        this.setData({
          fileID:res.fileID
        })
        todos.add({
          data:{
            fileID:res.fileID,
            uploadDate:Date.now(),
            dowmloadPassword:_this.data.passwordValue,
            downloadDateLimit:_this.data.downloadDateLimit,
            downloadNumLimit:_this.data.downloadNumLimit, 
            downloadNums:0 //默认下载次数是0
          },
          success: res => {
            wx.navigateTo({ //跳转至上传完成界面
              url: '../uploadFinishPage/uploadFinishPage?recordID='+res._id,
            })
            console.log(res)
          },
          fail: e => {
            console.log(e)
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

  onChangeNumLimit(e){
    this.setData({
      downloadNumLimit:e.detail
    })
  },

  onChangeDateLimit(e){
    this.setData({
      downloadDateLimit:e.detail
    })
  },

  previewImage() {
    wx.previewImage({
      urls: [this.data.fileSource],
      current: 'current',
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }

})