// miniprogram/pages/fileAccessUsers/fileAccessUsers.js
const db = wx.cloud.database()
var _this = null
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    fileID: '',
    userInfo: {},
    accessUsersList: [],// 需要调用的东西都存在userInfo属性里
    QRCodeSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    this.setData({
      userID: options.userInfo,
      fileID: options.fileID
    })
    db.collection('userInfo').where({
      _openid: this.data.userID
    })
    .get({
      success: function(res) {
        _this.setData({
          userInfo: res.data[0]._userInfo
        })
      }
    })
    db.collection('question_files').where({
      _id: this.data.fileID
    })
    .get({
      success: function(res) {
        _this.setData({
          accessUsersList: res.data[0].accessUsersList
        })
        var temp_accessUsersList = _this.data.accessUsersList
        var temp_specific_User_list = []
        let PromiseArr = []
        for(var i=0;i<temp_accessUsersList.length;i++){
          PromiseArr.push(new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: "getUserInfo",
            data: {
              userID: temp_accessUsersList[i].userID
            },
            success: res => {
              resolve(res)
              temp_specific_User_list.push(res.result.data[0])
            },
            fail: err => {
              reject(err)
            },
          })
        }))}
        Promise.all(PromiseArr).then(res => {
          console.log(temp_specific_User_list[0])
          for(var i=0;i<temp_accessUsersList.length;i++){
            for(var j=0;j<temp_specific_User_list.length;j++){
              if(temp_specific_User_list[j]._openid==temp_accessUsersList[i].userID){
                temp_accessUsersList[i].userInfo = temp_specific_User_list[j]._userInfo
              }
            }
          }
          _this.setData({
            accessUsersList:temp_accessUsersList
          })
        }, err => {
            console.log(err)
        })
      }
    })
  },

  testFunction: function(){
    _this = this
    wx.cloud.callFunction({
      name: "createQRCode",
      data: {
        type: "qr"
      },
      success: res => {
        console.log(res.result)
        _this.setData({
          QRCodeSrc: res.result
        })
      },
      fail: err => {
        reject(err)
      },
    })
  }
})