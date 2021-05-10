// miniprogram/pages/selectQuestionsPage/selectQuestionsPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filePath:'',
    fileType:'',
    totalQuestionsNum:0,
    needQuestionsNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filePath:options.filePath,
      fileType:options.fileType,
      totalQuestionsNum:options.totalQuestionsNum,
      needQuestionsNum:options.needQuestionsNum
    })
  },
})