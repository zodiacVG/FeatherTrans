// miniprogram/pages/selectQuestionsPage/selectQuestionsPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filePath:'',
    fileType:'',
    totalQuestionsNum:0,
    needQuestionsNum:0,
    questionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filePath:options.filePath,
      fileType:options.fileType,
      totalQuestionsNum:options.totalQuestionsNum,
      needQuestionsNum:options.needQuestionsNum,
    })
    console.log("答对问题数"+this.totalQuestionsNum);
    for(var i= 0;i<this.totalQuestionsNum;i++)
      questionList.push(i);
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