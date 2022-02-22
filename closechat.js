//引入解析req.body插件
const bodyParser = require('body-parser')

//引入token
const jwt = require('./dao/jwt')

const express = require('express')
const app = express()
const port = 3000

//socket.io
const server = app.listen(8082)
const io = require('socket.io')(server)
require('./dao/socket')(io)

//解析前端数据
//限制参数文件大小,处理request entity too large
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//每次请求都  判断token
//使用app.use中间件，接受所有请求方式
app.use((req, res, next) => {
  if (typeof (req.body.token) != 'undefined') {
    //处理token匹配
    const token = req.body.token
    const tokenMatch = jwt.verifyToken(token)
    if (tokenMatch == 1) {
      //通过token验证
      next()
    } else {
      //验证不通过
      res.send({status: 300})
    }
  } else {
    //没有token就通过(如登录注册)
    next()
  }
})

//引入路由(中间件放路由之前)
require('./router/index')(app)
require('./router/files')(app)

//获取静态路径
app.use(express.static(__dirname + '/data'))

//404页面
app.use((req, res, next) => {
  let err = new Error(' 404 Not Found')
  err.status = 404
  next(err)
})

//出现错误处理
app.use((req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})