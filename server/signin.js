const dbserver = require('../dao/dbserver')

//登录
exports.signIn = (req, res) => {
  const data = req.body.data
  const password = req.body.password
  dbserver.userMatch(data, password, res)
}
