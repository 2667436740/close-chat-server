const mongoose = require('mongoose');
const db = require('../config/db')
const Schema = mongoose.Schema

//用户表
const SchemaUser = new Schema({
  username: {type: String}, //用户名
  password: {type: String}, //密码
  email: {type: String}, //邮箱
  explain: {type: String}, //签名
  imgUrl: {type: String, default: 'user.png'}, //头像名（xxxxx.png）
  time: {type: Date}, //注册时间
  bgUrl: {type: String}, //背景名（xxxxx.png）
})

//好友表
const SchemaFriend = new Schema({
  userID: {type: Schema.Types.ObjectId, ref:'User'}, //用户名
  friendID: {type: Schema.Types.ObjectId, ref:'User'}, //密码
  state: {type: String}, //好友状态（0：已是好友，1：申请接收方，申请中，2：申请发送方，对方还未同意）
  time: {type: Date}, //生成时间
  lastTime: {type: Date}, //最后通讯时间
})

//一对一消息表
const SchemaMessage = new Schema({
  userID: {type: Schema.Types.ObjectId, ref:'User'}, //用户id
  friendID: {type: Schema.Types.ObjectId, ref:'User'}, //好友id
  message: {type: String}, //消息内容
  types: {type: String}, //内容类型（0：文字，1：图片链接，2：音频链接，3：定位）
  time: {type: Date}, //发送时间
  state: {type: Number}, //消息状态（0：已读，1：未读）
})



module.exports = db.model('User',SchemaUser)
module.exports = db.model('Friend',SchemaFriend)
module.exports = db.model('Message',SchemaMessage)