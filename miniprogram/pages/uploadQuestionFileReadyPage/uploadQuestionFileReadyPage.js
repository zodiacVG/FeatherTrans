// miniprogram/pages/uploadQuestionFileReadyPage/uploadQuestionFileReadyPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalQuestionsNum:5, //问题总数
    needQuestionsNum:3  //需要答对的问题数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onDragTotalQuestionsNum(e){
    this.setData({
      totalQuestionsNum:e.detail.value
    })
  },

  onDragNeedQuestionsNum(e){
    this.setData({
      needQuestionsNum:e.detail.value
    })
  }

})