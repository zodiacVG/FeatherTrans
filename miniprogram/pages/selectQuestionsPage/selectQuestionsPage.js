// miniprogram/pages/selectQuestionsPage/selectQuestionsPage.js
import Toast from '@vant/weapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalQuestionsNum:5,
    needQuestionsNum:3,
    questionList:[],
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
    this.setData({
      fileSource:options.filePath,
      fileType:options.fileType,
      totalQuestionsNum:parseInt(options.totalQuestionsNum),
      needQuestionsNum:parseInt(options.needQuestionsNum),
    })
    console.log(this.data)
    // 这里开始构建questionList，从数据库里面获取，有两个属性：问题+答案（数组）
    var temp_question = []
    wx.cloud.callFunction({ //用云函数测试
      name:'getQuestionFromCloud',
      data:{
        question_num:this.data.totalQuestionsNum
      },
      complete:(res)=>{
        temp_question = res.result.list
        for(var i=0;i<temp_question.length;i++){
          temp_question[i].radio = 0 
        }
        this.setData({
          questionList:temp_question,
        })
        console.log(this.data.questionList)
      },
    })

  },
  confirmSubmint: function(){
    var temp_questionList = this.data.questionList;
    var flag= true;
    for(var i=0;i<temp_questionList.length;i++){
      if(temp_questionList[i].radio==0){
        Toast.fail('问题'+(i+1)+'非空');
          flag=false;
      }
    }
    if(flag==true){
      const _this=this
      const cloudPath = `my-images`+Date.now()+getApp().globalData.openid
      console.log(_this.data.fileSource)
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: _this.data.fileSource,
        success: res => {
          this.setData({
            fileID:res.fileID
          })
          const db=wx.cloud.database()
          const todos=db.collection('question_files')
          todos.add({
            data:{
              fileID:res.fileID,
              uploadDate:Date.now(),
              downloadPassword:_this.data.passwordValue,
              downloadDateLimit:_this.data.downloadDateLimit,
              downloadNumLimit:_this.data.downloadNumLimit, 
              downloadNums:0, 
              needQuestionsNum:_this.data.needQuestionsNum,
              questionList: _this.data.questionList
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
    }
  },
  onChange: function(event){
    var idx = parseInt(event.target.dataset.idx)
    var temp_questionList = this.data.questionList
    temp_questionList[idx].radio = parseInt(event.detail)
    this.setData({
      questionList: temp_questionList
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
})