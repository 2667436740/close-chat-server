const dbserver = require('../dao/dbserver')

//分页获取一对一聊天消息
exports.msg = (req, res) => {
  const data = req.body
  dbserver.msg(data, res)
}

//撤回消息
exports.deleteMsg = (req, res) => {
  const data = req.body
  dbserver.deleteMsg(data, res)
}
