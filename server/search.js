const dbserver = require('../dao/dbserver')

//用户搜索
exports.searchUser = (req, res) => {
  const data = req.body.data
  dbserver.searchUser(data, res)
}

//是否为好友
exports.isFriend = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.isFriend(uid, fid, res)
}