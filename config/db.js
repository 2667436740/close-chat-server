var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://localhost:27017/closechat')
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.info('数据库closechat打开成功')
})

module.exports = db