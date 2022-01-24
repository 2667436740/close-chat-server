const bcrypt = require('bcryptjs');

//加密(生成hash密码)
exports.encryption = (e) => {
  //生成随机的salt
  const salt = bcrypt.genSaltSync(10);
  //生成hash密码
  const hash = bcrypt.hashSync(e, salt);
  return hash
}

//解密(验证密码)
exports.verification = (pwd,hashpwd) => {
  let verif = bcrypt.compareSync(pwd, hashpwd);
  return verif
}
