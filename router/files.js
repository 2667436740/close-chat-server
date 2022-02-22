//引入附件上传插件multer
const multer = require('multer')
const mkdir = require('../dao/mkdir')
const fs = require('fs');

//base64 => 图片
function base64ToImg(data, url, name, res) {
  const fileName = name + '.png';
  const path = 'data/' + url + '/' + name + '.png';
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
  const dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
  mkdir.mkdirs(`../data/${url}`, err => {
    console.log(err);
  })
  fs.writeFile(path, dataBuffer, function (err) {//用fs写入文件
    if (err) {
      console.log(err);
      res.send({status: 500})
    } else {
      console.log('写入成功！');
      const result = {
        fileName: fileName,
        path: path
      }
      res.send({status: 200, result: result})
    }
  })
}

//控制文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const url = req.body.url
    mkdir.mkdirs(`../data/${url}`, err => {
      console.log(err);
    })
    cb(null, `./data/${url}`) //后端存放文件夹,注意路径前加（.）
  },
  filename: function (req, file, cb) {
    const name = req.body.name
    //正则匹配后缀名(如.jpg)
    const type = file.originalname.replace(/.+\./, '.')
    cb(null, name + Date.now() + type)
  }
})

const upload = multer({storage: storage})

module.exports = function (app) {
  //前端文件上传
  app.post('/files/upload', upload.array('file', 10), (req, res, next) => {
    //获取文件信息
    const data = req.files
    res.send(data)
  })

  //裁剪头像上传
  app.post('/avatar/upload', (req, res) => {
    base64ToImg(req.body.base64, req.body.url, req.body.name, res)
  })
}