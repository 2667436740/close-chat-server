const dbserver = require('../dao/dbserver')

//获取好友列表
exports.getFriend = (req, res) => {
  const uid = req.body.uid
  const state = req.body.state
  dbserver.getUsers(uid, state, res)
}

//获取最后一条消息
exports.getLastMsg = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.getOneMsg(uid, fid, res)
}

//汇总一对一消息未读数
exports.getUnreadMsg = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.unreadMsg(uid, fid, res)
}

//清除消息未读数
exports.clearUnreadMsg  = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.updateMsg(uid, fid, res)
}