//引入token
const jwt = require('jsonwebtoken')
const secret = 'CChat-secret' //加密的key，为简便

//生产token
exports.generateToken = (id) => {
  const payload = {id: id, time: new Date()}
  const token = jwt.sign(payload, secret, {expiresIn: 60 * 60 * 24 * 120})
  return token
}

//解码token
exports.verifyToken = (e) => {
  let payload = 0
  jwt.verify(e, secret, (err, result) => {
    if (err) payload = 0
    else payload = 1 //正确且没失效的token
  })
  return payload
}
