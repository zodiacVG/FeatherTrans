// miniprogram/pages/shareOpenPage/shareOpenPage.js
const db = wx.cloud.database()
const todos = db.collection('question_files')
var _this = null
const app = getApp()
const oneDay = 24 * 60 * 60 * 1000

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isButtonForbidden:false, //按钮是否被禁用
    res: '',
    recordID: '',
    buttonText: '下载文件', //要是不符合条件就会变成其他文字 todo 最好按钮颜色也一并变化
    fileID: '',
    filePath: '',
    openid: '',
    userInfo: '',
    ownerOpenID: '',
    downloadNumLimit: -1,
    downloadNums: 0,
    downloadDateLimit: '',
    downloadPassword: '',
    actionSheetShow: false,
    showPasswordPop: false,
    is_password_false: false,
    enter_password: '',
    surplus_enter_num: 5,//输入密码容许五次输入错误
    questionList: [],
    accessUsersList: [],
    showQuestionPop: false,
    questionErrorTip: false,
    questionErrorText: '',
    needQuestionsNum: 0,
    actions: [{
      name: '保存到手机'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.setData({
      recordID:options.recordID
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        _this.setData({
          openid: res.result.openid
        })
        app.globalData.openid = res.result.openid
        _this.InitalConditionCheck()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  InitalConditionCheck(){
    _this = this
    todos.doc(this.data.recordID).get({ //云数据库里获取文件数据
      success: (res) => {
        this.setData({
          res: res.data,
          fileID: res.data.fileID
        })
        wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            userID: _this.data.openid
          },
          success: res => {
            _this.setData({
              userInfo: res.result.data[0]._userInfo
            })
          },
          fail: err => {
            reject(err)
          }
        })
        //开始给页面元素赋值
        var oneDay = 24 * 60 * 60 * 1000
        var res = this.data.res
        this.setData({
          downloadDateLimit: res.uploadDate + res.downloadDateLimit * oneDay,
          downloadNumLimit: res.downloadNumLimit,
          downloadNums: res.downloadNums,
          questionList: res.questionList,
          downloadPassword: res.downloadPassword,
          needQuestionsNum: res.needQuestionsNum,
          accessUsersList: res.accessUsersList,
          ownerOpenID: res._openid
        })
        // 先判断这人之前有没有访问过
        var access_list = this.data.accessUsersList
        var this_user_openID = app.globalData.openid 
        var is_contained = false
        for(var i=0;i<access_list.length;i++){
          if(this_user_openID==access_list[i].userID){
            is_contained = true
          }
        }
        // for循环可能要遍历一下，我怕还没遍历完就直接判断容易gg
        if(is_contained==true){
          wx.switchTab({
            url: '../index/index',
          })
          wx.showToast({
            title: '辣鸡答过了 爬',
            duration: 5000,
          })
          wx.hideLoading({
            success: (res) => {},
          })
          return
        }    
        wx.hideLoading({
          success: (res) => {},
        })
        //判断下载次数
        if (res.downloadNumLimit != -1) { //等于-1说明没有设置限制
          if (res.downloadNumLimit <= res.downloadNums) { //限制次数等于实际下载次数
            this.setData({
              buttonText: '超过下载次数限制',
              isButtonForbidden:true
            })
            return
          }
        }
        //判断日期
        if (res.downloadDateLimit * 24 * 60 * 60 * 1000 + res.uploadDate < Date.now()) { //超时了的话
          this.setData({
            buttonText: '超过下载期限'
          })
          return
        }
      },
      fail: (res) => {
        console.log('失败了')
      }
    })
  },
  closePasswordPop: function(){
    this.setData({
      showPasswordPop:false,
      is_password_false:false,
      enter_password:''
    })
  },
  downloadSharedFile() { //点击下载按钮之后
    if(this.data.isButtonForbidden==true){
      return
    }
   // 没有密码的情况
    if(this.data.downloadPassword==''){
      this.setData({
        showQuestionPop:true
      })
    }
    else{
      this.setData({
        showPasswordPop:true
      })
    } 
  },
  updateAccessUsersData: function(right_num, total_num){
    var access_item= {userID:app.globalData.openid,userRightNum:right_num,userTotalNum:total_num}
    this.data.accessUsersList.push(access_item)
    db.collection('question_files').doc(this.data.recordID).update({
      data: {
        accessUsersList: this.data.accessUsersList
      },
      success: function(res) {
        console.log("访客数据更新成功")
      }
    })
  },
  downloadFile: function(){
    _this = this
    wx.cloud.downloadFile({
      fileID: this.data.fileID,
      success: res => {
        this.setData({
          filePath: res.tempFilePath
        })
        //还应当减少文件的下载次数
        wx.cloud.callFunction({
          name:'reduceQuestionFileDownloadTimes',
          data:{
            recordID:_this.data.recordID
          },
          complete:(res)=>{
            console.log('增加了下载次数')
            console.log(res)
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '下载文件失败了',
          duration: 5000,
        })
      }
    })
  },
  enterPasswordChange: function(event) {
    this.setData({
      enter_password:event.detail
    })
  },
  confirmEnterPassword: function(event){
    if(this.data.enter_password==this.data.downloadPassword){
      this.closePasswordPop()
      this.setData({
        showQuestionPop:true
      })
    }
    else{
      this.setData({
        is_password_false:true,
        enter_password:'',
        surplus_enter_num:this.data.surplus_enter_num-1
      })
    }
    if(this.data.surplus_enter_num<=0){
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  closeQuestionPop: function() {
    this.setData({
      showQuestionPop:false
    })
  },
  onGetOpenid: function () {
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
  onQuestionChange: function(event) {
    var idx = parseInt(event.target.dataset.idx)
    var temp_questionList = this.data.questionList
    temp_questionList[idx].chooseAnswer = parseInt(event.detail)
    this.setData({
      questionList: temp_questionList
    })
  },
  confirmQuestion: function() {
    console.log('看看选项')
    console.log(this.data.questionList)
    for(var i=0;i<this.data.questionList.length;i++){
      if(this.data.questionList[i].chooseAnswer==0){
        this.setData({
          questionErrorTip:true,
          questionErrorText: '问题'+(i+1)+'非空'
        })
        return
      }
    }
    var right_count = 0
    for(var i=0;i<this.data.questionList.length;i++){
      if(this.data.questionList[i].radio==this.data.questionList[i].chooseAnswer) {
        right_count++
      }
    }
    if(right_count>=this.data.needQuestionsNum){
      this.downloadFile()
      this.setData({
        isButtonForbidden:true,
        showQuestionPop:false
      })
            // 这里密码输入正确说明这人去答题了，我们提示一下文件主
            wx.cloud.callFunction({
              name: 'sendMessage',
              data: {
                'accepterID': _this.data.ownerOpenID,
                'messageContent': '123',
                'senderName': _this.data.userInfo.nickName+'参与了答题，答题情况：正确/总数( '+right_count+' / '+_this.data.needQuestionsNum+' )。',
                'sendTime': new Date()
              },
              success: res => {
                console.log('[云函数] 调用成功')
              },
              fail: err => {
                console.error('[云函数] 调用失败', err)
              }
            })
      _this.updateAccessUsersData(right_count,_this.data.questionList.length)
    }
    else{
      wx.switchTab({
        url: '../index/index'
      })
      wx.showToast({
        title: '题目错太多，你不太行！',
        duration: 5000,
      })
    }
  },
  previewImage() {
    wx.previewImage({
      urls: [this.data.filePath],
      current: 'current',
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})