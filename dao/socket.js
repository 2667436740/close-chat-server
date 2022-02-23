const dbserver = require('../dao/dbserver')

module.exports = function (io) {
  let users = []; //用户登录注册socket
  io.on('connection', (socket) => {
    //用户登录注册
    socket.on('login', id => {
      console.log(socket.id + '上线');
      //回复客户端
      socket.emit('login', id);
      socket.name = id;
      const rooms = users.map(e=>{
        return e.room
      })
      if (rooms.includes(socket.id)) {
        return
      } else {
        users.push({room: socket.id, id: id})
      }
      console.log('当前users上线列表：' + JSON.stringify(users))
    })

    //好友申请
    socket.on('newFriend', (toId) => {
      console.log(toId);
      //回复客户端
      users.map(e => {
        //用户在线状态
        if (e.id == toId) {
          //发送给对方
          socket.to(e.room).emit('newFriend', toId)
        }
      });
    })

    //同意好友申请
    socket.on('agree', (toId) => {
      console.log(toId);
      //回复客户端
      users.map(e => {
        //用户在线状态
        if (e.id == toId) {
          //发送给对方
          socket.to(e.room).emit('agree', toId)
        }
      });
    })

    //一对一聊天消息
    socket.on('msg', (msgObj, fromId, toId) => {
      console.log(msgObj, fromId, toId);
      console.log('当前users上线列表：' + JSON.stringify(users))
      //更新好友最后通讯时间
      dbserver.upFriendLastTime(fromId, toId)
      //添加一对一消息
      dbserver.insertMsg(fromId, toId, msgObj[0].message, msgObj[0].types)
      //回复客户端
      users.map(e => {
        //用户在线状态
        if (e.id == toId) {
          //发送给对方
          socket.to(e.room).emit('msg', msgObj, fromId, 0)
        }
        //发送给自己
        socket.emit('msg', msgObj, toId, 1)
      });
    })

    //用户离开
    socket.on('disconnecting', () => {
      users.map((e, i) => {
        if (e.id == socket.name) {
          users.splice(i, 1)
          console.log(socket.id + '离开');
          console.log('当前users上线列表：' + JSON.stringify(users))
        }
      })
    })
  });
}