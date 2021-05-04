// miniprogram/pages/shareOpenPage/shareOpenPage.js
const db = wx.cloud.database()
const todos = db.collection('files')
var _this = null
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: '',
    recordID: '',
    buttonText: '下载文件', //要是不符合条件就会变成其他文字 todo 最好按钮颜色也一并变化
    fileID: '',
    filePath: '',
    downloadNumLimit: -1,
    downloadDateLimit: '',
    actionSheetShow: false,
    actions: [{
      name: '保存到手机'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.onGetOpenid()
    this.setData({
      recordID: options.recordID
    })
    todos.doc(this.data.recordID).get({
      success: (res) => {
        console.log('数据库里查到的数据' + res.data)
        this.setData({
          res: res.data,
          fileID: res.data.fileID
        })
        //开始给页面元素赋值
        var oneDay = 24 * 60 * 60 * 1000
        var res = this.data.res
        console.log('走到赋值前了')
        this.setData({
          downloadDateLimit: res.uploadDate + res.downloadDateLimit * oneDay,
          downloadNumLimit: res.downloadNumLimit
        })

        //开始判断文件附加条件
        //判断下载次数
        console.log('走到判断num了')
        if (res.downloadNumLimit != -1) {
          if (res.downloadNumLimit == 0) {
            this.setData({
              buttonText: '超过下载次数限制'
            })
            return
          }
        }
        //判断日期
        console.log('走到判断date了')
        if (res.downloadDateLimit * 24 * 60 * 60 * 1000 + res.uploadDate < Date.now()) { //超时了的话
          this.setData({
            buttonText: '超过下载期限'
          })
          return
        }
        console.log('走到判断pass了')
        //判断密码
        if (res.downloadPassword != '') { //如果有密码的话,应该弹窗！
          this.setData({ //todo 正式使用密码需要加密处理
            downloadPassword: res.downloadPassword
          })
        }
      },
      fail: (res) => {
        console.log('失败了')
      }
    })

  },

  downloadSharedFile() {
    wx.cloud.downloadFile({
      fileID: this.data.fileID,
      success: res => {
        this.setData({
          filePath: res.tempFilePath
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

  //暂未用到
  tapToSaveImg(e) {
    //用户需要授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              // 同意授权
              this.saveImg1(thsi.data.filePath);
            },
            fail: (res) => {
              console.log(res);
            }
          })
        } else {
          // 已经授权了
          this.saveImg1(this.data.filePath);
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },

  //暂未用到
  saveImg1(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: (res) => {
        wx.showToast({
          title: '保存成功'
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '您已取消保存',
          icon: "none"
        });
      }
    })
  },

  //暂未用到
  actionSheetOnClose() { //关闭选择菜单
    thsi.setData({
      actionSheetShow: false
    })
  },

  //暂未用到
  actionSheetOnSlect(e) {
    var result = e.detail
    if (e == '保存到手机') {
      this.tapToSaveImg()
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