// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const _=db.command
  const db = cloud.database()
  const todos = db.collection('files')

  return todos.doc(event.recordID).update({
    downloadNums:_.inc(1) //下载次数+1
  })
}