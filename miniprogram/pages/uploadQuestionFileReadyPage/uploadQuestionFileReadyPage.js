// miniprogram/pages/uploadQuestionFileReadyPage/uploadQuestionFileReadyPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileSource:'', //文件路径
    fileType:'',  //文件类型
    totalQuestionsNum:5, //问题总数
    needQuestionsNum:3  //需要答对的问题数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fileSource:options.filePath,
      fileType:options.fileType
    })
  },

  onDragTotalQuestionsNum(e){ //拖拽进度条   
    this.setData({
      totalQuestionsNum:e.detail.value
    })
    // this.selectComponent('#needQuestionsNumSlider').init({
    //   ...this.data.data
    // })
  },

  onDragNeedQuestionsNum(e){
    this.setData({
      needQuestionsNum:e.detail.value
    })
  },

  startSelectQuestion(){ //开始选择问题,跳转界面
    wx.navigateTo({
      url: '../selectQuestionsPage/selectQuestionsPage?filePath='+this.data.fileSource+
      '&fileType='+this.data.fileType+'&totalQuestionsNum='+this.data.totalQuestionsNum+
      '&needQuestionsNum='+this.data.needQuestionsNum
    })
  }

})