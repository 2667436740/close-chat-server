const dbserver = require('../dao/dbserver')

//用户详情
exports.userDetail = (req, res) => {
  const id = req.body.id
  dbserver.userDetail(id, res)
}

//用户信息修改
exports.userUpdate = (req, res) => {
  const data = req.body   //这里传整个data去dbserver详细判断
  dbserver.userUpdate(data, res)
}

