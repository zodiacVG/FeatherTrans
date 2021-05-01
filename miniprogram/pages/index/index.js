//index.js 测试git
const app = getApp()
var _this
Page({
  data: {
    activeTab:0,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl'), // 如需尝试获取用户信息可改为false,
    pop_show:false, //弹窗的显示控制
    textValue:"",
    jpg_source:"",
    actionSheetShow: false,
    actions: [
      {
        name: '从手机相册选择',
      },
      {
        name: '从聊天记录选择',
      },
      {
        name: '选项3',
      },
    ],
  },

  onLoad: function() {
    _this = this
  },

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  doUpload(filePath,fileType){
    wx.navigateTo({
      url: '../upload_ready/upload_ready?filePath='+filePath+'&fileType='+fileType
    })
  },
  // 上传图片
  chooseByAlbum: function () { //从手机相册选择
    // 选择图片
    console.log("从手机相册选择被调用")
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        _this.doUpload(filePath,"image")
        // 上传图片
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  
  tapUploadButton(){
    this.setData({
      actionSheetShow:true
    })
  },


  downFile:function(e){
    this.setData({
      pop_show:true
    })
  },

  onChange_text(event){
    this.setData({
      textValue:event.detail
    }),
    console.log(this.data.textValue)
  },

  comfirmFile(){
    console.log('call comfirmFile')
    wx.cloud.downloadFile({
      fileID: this.data.textValue, // 文件 ID
      success: res => {
        // 返回临时文件路径
        console.log(res.tempFilePath)
        this.setData({
          jpg_source:res.tempFilePath
        })
      },
      fail: console.error
    })
  },
  
  onClose(){
    console.log('close')
  },

  onCloseActionSheet() {
    console.log('调用了！')
    this.setData({ actionSheetShow: false });
  },

  onSelectActionSheet(event) {
    console.log(event.detail);
    var resultFromActionSheet=event.detail;
    if(resultFromActionSheet.name=="从手机相册选择"){
      this.chooseByAlbum()
      return 
    }
    if(resultFromActionSheet.name="从聊天记录选择"){
      console.log("从聊天记录选择别调用")
      wx.chooseMessageFile({
        count: 10,
        type: 'all',
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFile = res.tempFiles[0]
          _this.doUpload(tempFile.path,tempFile.type)
        }
      })
    }
  },

  tabOnChange(e){
    this.setData({
      activeTab:e.detail
    })
    console.log(this.activeTab)
    if(this.data.activeTab==1){
      console.log('成了！')
      wx.reLaunch({
        url: '../MyPage/MyPage',
      })
    }
  }

})
