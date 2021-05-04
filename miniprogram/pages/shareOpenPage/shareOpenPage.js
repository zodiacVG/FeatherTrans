// miniprogram/pages/shareOpenPage/shareOpenPage.js
const db=wx.cloud.database()
const todos=db.collection('files')
var _this=null
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID:'',
    filePath:'',
    actionSheetShow:false,
    actions:[
      {
        name:'保存到手机'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this=this
    this.onGetOpenid()
    this.setData({ 
      fileID:options.fileID
    })
    todos.doc(this.data.fileID).get({
      success:(res)=>{
        console.log('数据库里查到的数据'+res)
      }
    })
    this.setData({ //打开界面时就查询到文件的ID
      fileID:options.fileID
      //todo 应该还要能够查到密码等信息
    })

  },

  downloadSharedFile(){
  wx.cloud.downloadFile({
    fileID:this.data.fileID,
    success:res => {
      this.setData({
        filePath:res.tempFilePath
      })
    },
    fail(res){
      wx.showToast({
        title: '下载文件失败了',
        duration: 5000,
      })
    }
  })
  },

  onGetOpenid: function() {
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

  tapToSaveImg(e){
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success:()=> {
              // 同意授权
              this.saveImg1(thsi.data.filePath);
            },
            fail: (res) =>{
              console.log(res);
            }
          })
        }else{
          // 已经授权了
          this.saveImg1(this.data.filePath);
        }
      },
      fail: (res) =>{
        console.log(res);
      }
    })   
  },

  saveImg1(filePath){
    wx.saveImageToPhotosAlbum({
      filePath:filePath,
      success:(res)=> { 
         wx.showToast({
         title:'保存成功'
         });
      },
      fail:(res)=>{
         wx.showToast({
           title:'您已取消保存',
           icon:"none"
         });
      }
     })
  },

  actionSheetOnClose(){ //关闭选择菜单
    thsi.setData({
      actionSheetShow:false
    })
  },

  actionSheetOnSlect(e){
    var result=e.detail
    if(e=='保存到手机'){
      this.tapToSaveImg()
    }
  },

  previewImage(){
    wx.previewImage({
      urls: [this.data.filePath],
      current: 'current',
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})