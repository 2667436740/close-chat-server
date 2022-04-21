const dbserver = require('../dao/dbserver')
const emailserver = require('../dao/emailserver')
const signup = require('../server/signup')
const signin = require('../server/signin')
const search = require('../server/search')
const userdetail = require('../server/userdetail')
const friend = require('../server/friend')
const index = require('../server/index')
const chat = require('../server/chat')

module.exports = function (app) {
  app.get('/test', (req, res) => {
    dbserver.findUser(res)
  })

  app.get('/aabb', (req, res) => {
    res.send({
      data: 'aabb!',
      status: 200
    })
  })

  //--------邮箱测试
  app.post('/mail', (req, res) => {
    let email = req.body.email
    emailserver.emailSignUp(email, res)
  })

  //--------注册页面
  //注册
  app.post('/signup/add', (req, res) => {
    signup.signUp(req, res)
  })
  //用户或邮箱是否占用判断
  app.post('/signup/judge', (req, res) => {
    signup.judgeValue(req, res)
  })

  //--------登陆页面
  //登录
  app.post('/signin/match', (req, res) => {
    signin.signIn(req, res)
  })

  //--------搜索页面
  //搜索用户
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res)
  })
  //是否为好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res)
  })

  //--------token测试
  app.post('/signin/test', (req, res) => {
    res.send('这里token正确')
  })

  //--------用户详情
  //用户详情
  app.post('/user/detail', (req, res) => {
    userdetail.userDetail(req, res)
  })
  //用户信息修改
  app.post('/user/update', (req, res) => {
    userdetail.userUpdate(req, res)
  })

  //--------好友操作
  //申请好友
  app.post('/friend/applyfriend', (req, res) => {
    friend.applyFriend(req, res)
  })
  //申请更新好友状态，同意好友
  app.post('/friend/updatefriendstate', (req, res) => {
    friend.updateFriendState(req, res)
  })
  //拒绝好友或删除好友
  app.post('/friend/deletefriend', (req, res) => {
    friend.deleteFriend(req, res)
  })

  //--------主页
  //获取好友
  app.post('/index/getfriend', (req, res) => {
    index.getFriend(req, res)
  })
  //获取最后一条消息
  app.post('/index/getlastmsg', (req, res) => {
    index.getLastMsg(req, res)
  })
  //汇总一对一消息未读数
  app.post('/index/getunreadmsg', (req, res) => {
    index.getUnreadMsg(req, res)
  })
  //清除消息未读数
  app.post('/index/clearunreadmsg', (req, res) => {
    index.clearUnreadMsg(req, res)
  })

  //--------聊天页
  //分页获取一对一聊天消息
  app.post('/chat/msg', (req, res) => {
    chat.msg(req, res)
  })
  //撤回消息
  app.post('/chat/deletemsg', (req, res) => {
    chat.deleteMsg(req, res)
  })
}