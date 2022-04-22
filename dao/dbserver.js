//引入写好的加密文件
const bcrypt = require('./bcrypt');
//引入写好的token
const jwt = require('./jwt')
const dbmodel = require('../model/dbmodel')
const User = dbmodel.model('User')
const Friend = dbmodel.model('Friend')
const Message = dbmodel.model('Message')

exports.findUser = (res) => {
  User.find((err, val) => {
    if (err) console.log('找不到数据' + err)
    else res.send(val)
  })
}

//新建用户
exports.buildUser = (name, mail, pwd, res) => {
  //密码加密
  const encryptPwd = bcrypt.encryption(pwd)

  const data = {
    username: name,
    password: encryptPwd,
    email: mail,
    time: new Date().getTime()
  }

  const user = new User(data)
  user.save((err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200})
  })
}

//匹配用户表元素个数
exports.countUserValue = (data, type, res) => {
  let wherestr = {}
  wherestr[type] = data
  User.countDocuments(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200, result})
  })
}

//用户验证
exports.userMatch = (data, pwd, res) => {
  let wherestr = {$or: [{'username': data}, {'email': data}]}
  let out = {'username': 1, 'imgUrl': 1, 'password': 1, 'bgUrl': 1}
  User.find(wherestr, out, (err, result) => {
    if (err) res.send({status: 500})
    else {
      if (result == '') res.send({status: 400}) //没有此用户名或邮箱
      result.map(e => {
        //verification判断  输入密码  和  解码的数据库密码  是否相等
        const pwdMatch = bcrypt.verification(pwd, e.password)
        if (pwdMatch) {
          const token = jwt.generateToken(e._id)
          const back = {
            id: e._id,
            username: e.username,
            imgUrl: e.imgUrl,
            token: token,
            bgUrl: e.bgUrl,
          }
          res.send({status: 200, back})
        } else {
          res.send({status: 401}) //密码匹配失败
        }
      })
    }
  })
}

//搜索用户
exports.searchUser = (data, res) => {
  let wherestr = {$or: [{'username': {$regex: data}}, {'email': {$regex: data}}]}  //{$regex:data}模糊搜索
  let out = {'username': 1, 'email': 1, 'imgUrl': 1}
  User.find(wherestr, out, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200, result})
  })
}

//判断是否为好友
exports.isFriend = (uid, fid, res) => {
  let wherestr = {'userID': uid, 'friendID': fid, 'state': 0}
  Friend.findOne(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else {
      if (result) res.send({status: 200}) //是好友
      else res.send({status: 400}) //不是好友
    }
  })
}

//用户详情
exports.userDetail = (id, res) => {
  let wherestr = {'_id': id}
  let out = {'password': 0}
  User.findOne(wherestr, out, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200, result})
  })
}

//用户信息修改
exports.userUpdate = (data, res) => {
  let updateStr = {}
  //是否有密码
  if (typeof (data.password) != 'undefined') {
    //有密码进行匹配
    User.find({'_id': data.id}, {'password': 1}, (err, result) => {
      if (err) res.send({status: 500})
      else {
        if (result == '') res.send({status: 400})
        result.map(e => {
          //verification判断  输入密码  和  解码的数据库密码  是否相等
          const pwdMatch = bcrypt.verification(data.password, e.password)
          if (pwdMatch) {
            //密码验证成功
            //如果为修改密码，给新密码加密
            if (data.type == 'password') {
              const encryptPwd = bcrypt.encryption(data.data)
              updateStr[data.type] = encryptPwd
            } else {
              updateStr[data.type] = data.data
            }
            User.findByIdAndUpdate(data.id, updateStr, (err, result) => {
              if (err) res.send({status: 500}) //修改失败
              else res.send({status: 200}) //修改成功
            })
          } else {
            res.send({status: 401}) //密码匹配失败
          }
        })
      }
    })
  } else {
    //没有密码更新其他信息
    updateStr[data.type] = data.data
    User.findByIdAndUpdate(data.id, updateStr, (err, result) => {
      if (err) res.send({status: 500}) //修改失败
      else res.send({status: 200}) //修改成功
    })
  }
}

//好友操作
//添加好友表
exports.buildFriend = (uid, fid, state, res) => {
  const data = {
    userID: uid,
    friendID: fid,
    state: state,
    time: new Date(),
    lastTime: new Date()
  }

  const friend = new Friend(data)
  friend.save((err, result) => {
    if (err) console.log('添加好友表出错')
    else console.log('添加好友表成功')
  })
}

//更新好友最后通讯时间
exports.upFriendLastTime = (uid, fid, res) => {
  let wherestr = {$or: [{'userID': uid, 'friendID': fid}, {'userID': fid, 'friendID': uid}]}
  let updatestr = {'lastTime': new Date()}
  Friend.updateMany(wherestr, updatestr, (err, result) => {
    if (err) console.log('更新好友最后通讯时间出错')
    else console.log('更新好友最后通讯时间成功')
  })
}

//添加一对一消息
exports.insertMsg = (uid, fid, msg, type, uuid, res) => {
  const data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type, //内容类型（0：文字，1：图片链接，2：音频链接，3：定位）
    uuid: uuid, //消息唯一id
    time: new Date().getTime(),
    state: 1, //消息状态（0：已读，1：未读）
  }

  const message = new Message(data)
  message.save((err, result) => {
    if (err) {
      if (res) res.send({status: 500})
    } else {
      if (res) res.send({status: 200})
    }
  })
}

//删除一对一消息(撤回消息)
exports.deleteMsg = (data, res) => {
  let wherestr = {uuid: data.uuid}
  console.log(wherestr)

  Message.deleteOne(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200})
  })
}

//好友申请
exports.applyFriend = (data, res) => {
  console.log(data)
  //判断是否已经申请过
  let wherestr = {'userID': data.uid, 'friendID': data.fid}
  console.log(wherestr);
  Friend.countDocuments(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else {
      console.log('查询到好友申请数量：', result);
      if (result == 0) {
        //初次申请
        this.buildFriend(data.uid, data.fid, 2)
        this.buildFriend(data.fid, data.uid, 1)
      } else {
        //已经申请过
        this.upFriendLastTime(data.uid, data.fid)
      }
      //添加申请消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, data.uuid, res)
    }
  })
}

//更新好友状态，同意好友
exports.updateFriendState = (uid, fid, res) => {
  let wherestr = {$or: [{'userID': uid, 'friendID': fid}, {'userID': fid, 'friendID': uid}]}
  Friend.updateMany(wherestr, {'state': 0}, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200})
  })
}

//拒绝好友或删除好友
exports.deleteFriend = (uid, fid, res) => {
  let wherestr = {$or: [{'userID': uid, 'friendID': fid}, {'userID': fid, 'friendID': uid}]}
  Friend.deleteMany(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200})
  })
}

//按要求获取用户列表
exports.getUsers = (uid, state, res) => {
  const query = Friend.find({})
  //查询条件
  query.where({'userID': uid, 'state': state})
  //查找friendID 关联的user对象
  query.populate('friendID')
  //排序方式
  query.sort({'lastTime': -1}) //-1从大到小排，最后通讯时间倒序
  //查询结果
  query.exec().then(e => {
    const result = e.map(ver => {
      return {
        id: ver.friendID._id,
        username: ver.friendID.username,
        imgUrl: ver.friendID.imgUrl,
        lastTime: ver.lastTime.valueOf() //ISODate转换为时间戳
      }
    })
    res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}

//按要求获取一对一消息
exports.getOneMsg = (uid, fid, res) => {
  const query = Message.findOne({})
  //查询条件
  query.where({$or: [{'userID': uid, 'friendID': fid}, {'userID': fid, 'friendID': uid}]})
  //排序方式
  query.sort({'time': -1}) //-1从大到小排，最后时间倒序
  //查询结果
  query.exec().then(e => {
    const result = {
      message: e.message,
      types: e.types,
      time: e.time,
    }
    res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}

//汇总一对一消息未读数
exports.unreadMsg = (uid, fid, res) => {
  //汇总条件
  let wherestr = {'userID': fid, 'friendID': uid, 'state': 1}
  Message.countDocuments(wherestr, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200, result})
  })
}

//一对一消息状态修改
exports.updateMsg = (uid, fid, res) => {
  //修改项条件
  let wherestr = {'userID': uid, 'friendID': fid, 'state': 1}
  //修改内容
  let updatestr = {'state': 0}
  Message.updateMany(wherestr, updatestr, (err, result) => {
    if (err) res.send({status: 500})
    else res.send({status: 200})
  })
}

//消息操作
//分页获取一对一聊天消息
exports.msg = (data, res) => {
  const skipNum = data.nowPage * data.pageSize //跳过的条数
  const query = Message.find({})
  //查询条件
  query.where({$or: [{'userID': data.uid, 'friendID': data.fid}, {'userID': data.fid, 'friendID': data.uid}]})
  //排序方式
  query.sort({'time': -1}) //-1从大到小排，最后时间倒序
  //查找friendID 关联的 user对象
  query.populate('userID')
  //跳过条数
  query.skip(skipNum)
  //一页条数
  query.limit(data.pageSize)
  //查询结果
  query.exec().then(e => {
    const result = e.map(ver => {
      return {
        id: ver._id,
        message: ver.message,
        types: ver.types,
        time: ver.time.valueOf(), //ISODate转换为时间戳
        fromId: ver.userID._id,
        imgUrl: ver.userID.imgUrl,
        uuid: ver.uuid,
      }
    })
    res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}