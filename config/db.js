var mongoose = require('mongoose')

// var db = mongoose.createConnection('mongodb://localhost:27017/closechat')
//连接   某数据库且带用户密码  的mongodb
var db = mongoose.createConnection('mongodb://root:ZXCzxc1234560@124.222.244.60:12121/closechat?authSource=admin')
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.info('数据库closechat打开成功')
})

module.exports = db
