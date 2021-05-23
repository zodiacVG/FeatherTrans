// miniprogram/pages/uploadFinishPage/uploadFinishPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordID:'',
    shareName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recordID:options.recordID,
      shareName:options.shareName
    })
  },
  onShareAppMessage(){ //todo 需要完成分享进入页面
    return{
      title:'给你分享了一个文件',
      desc:'分享页面内容',
      path:'/pages/shareOpenPage/shareOpenPage?recordID='+this.data.recordID
    }
  }
})