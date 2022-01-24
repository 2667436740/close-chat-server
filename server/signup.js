const dbserver = require('../dao/dbserver')
const email = require('../dao/emailserver')

//用户注册
exports.signUp = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const mail = req.body.email
  email.emailSignUp(mail, res)
  dbserver.buildUser(username, mail, password, res)
}

//用户或邮箱是否占用判断
exports.judgeValue = (req, res) => {
  const data = req.body.data
  const type = req.body.type
  dbserver.countUserValue(data, type, res)
}

