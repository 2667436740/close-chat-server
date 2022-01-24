const dbserver = require('../dao/dbserver')

//好友申请
exports.applyFriend = (req, res) => {
  const data = req.body
  dbserver.applyFriend(data, res)
}

//更新好友状态，同意好友
exports.updateFriendState = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.updateFriendState(uid, fid, res)
}

//拒绝好友或删除好友
exports.deleteFriend = (req, res) => {
  const uid = req.body.uid
  const fid = req.body.fid
  dbserver.deleteFriend(uid, fid, res)
}