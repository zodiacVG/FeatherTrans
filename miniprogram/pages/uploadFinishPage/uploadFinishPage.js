// miniprogram/pages/uploadFinishPage/uploadFinishPage.js
var _this = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordID:'',
    shareName:'',
    shareType:'',
    QRCodeSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // recordID:options.recordID,
      recordID: '79550af260aa134d19663b732d892b5e', //暂时这么代替
      shareName:options.shareName,
      // shareType:options.shareType
      shareType: 'question'
    
    })
  },
  onShareAppMessage(){ //todo 需要完成分享进入页面
    if(this.data.shareType=='normal'){
      return{
        title:'给你分享了一个文件',
        desc:'分享页面内容',
        path:'/pages/shareOpenPage/shareOpenPage?recordID='+this.data.recordID
      }
    }else{
      return{
        title:'给你分享了一个文件',
        desc:'分享页面内容',
        path:'/pages/downloadQuestionFile/downloadQuestionFile?recordID='+this.data.recordID
      }
    }
    
  },
  createQRCode() {
    _this = this
    wx.cloud.callFunction({
      name: "createQRCode",
      data: {
        type: "qr",
        fileType: _this.data.shareType,
        recordID: _this.data.recordID
      },
      success: res => {
        _this.setData({
          QRCodeSrc: res.result
        })
      },
      fail: err => {
        console.log('gg!')
      },
    })
  }
})