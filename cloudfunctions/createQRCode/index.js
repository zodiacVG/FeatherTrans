// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:'yunpan-q8fv9'})
const log = cloud.logger()
const uploadFile = async function(arrayBuffer,path) {
  let {fileID} = await cloud.uploadFile({
    cloudPath: path,
    fileContent: arrayBuffer,
  })
  return fileID
}

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('调用了云函数创建二维码2')
  const wxContext = cloud.getWXContext()
  var type = event.type
  var shareType = event.shareType
  var recordID = event.recordID
  var my_filePath = ''
  if(shareType=='normal'){
    my_filePath = 'pages/shareOpenPage/shareOpenPage?recordID='
    console.log("filepath是"+my_filePath)
  }
  else{
    my_filePath = 'pages/downloadQuestionFile/downloadQuestionFile?recordID='
  }
  switch (type) {
    case "qr":
      try {
        let {
          buffer
        } = await cloud.openapi.wxacode.createQRCode({
          path: my_filePath+recordID,
          width: 430
        })
        fileID = await uploadFile(buffer,recordID+".jpg")    
        console.log("fileID is"+fileID)
        return fileID
      } catch (err) {
        log.error({
          err
        })
        return err
      }
      break;
    case 'miniapp':
      try {
        let {
          buffer
        }= await cloud.openapi.wxacode.get({
          path: my_filePath+recordID,
          width: 430,
            auto_color:true,
            is_hyaline:true
        })
        fileID = await uploadFile(buffer,recordID+".jpg")        
        return fileID
      } catch (err) {
        log.error({
          err
        })
        return err
      }
      break;
    case "unlimited":
      try {
        let {
          buffer
        } = await cloud.openapi.wxacode.getUnlimited({
          scene:"id=1",
          path: my_filePath+recordID,
          width: 430
        })
        fileID = await uploadFile(buffer,recordID+".jpg")
        
        return fileID
      } catch (err) {
        log.error({
          err
        })
        return err
      }
      break;
  }
}