const nodemailer = require("nodemailer");

//引入邮箱证书
const credentials = require('../config/credentials')

//qq邮箱服务
let transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass,
  },
});

//发送邮件
exports.emailSignUp = (email, res) => {
  //邮件信息
  let options = {
    from: '2667436740@qq.com',
    to: email,
    subject: '感谢注册CloseChat',
    html: '<span>CloseChat欢迎新CCer的加入</span><a href="http://localhost:8080">点击即刻进入</a>'
  }

  //发送邮件
  transporter.sendMail(options, (err, msg) => {
    if (err) {
      res.send(err)
      console.log(err)
    }
    else {
      res.send('发送邮件成功')
      console.log('发送邮件成功');
    }
  });
}