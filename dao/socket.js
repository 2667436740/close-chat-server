module.exports = function (io) {
  io.on('connection', (socket) => {
    let users = []; //用户登录注册socket
    //用户登录注册
    socket.on('login', id => {
      console.log(socket.id + '上线');
      //回复客户端
      socket.emit('login', id);
      socket.name = id;
      users.push({room: socket.id, id: id})
    })

    //一对一聊天消息
    socket.on('msg', (msgObj, fromId, toId) => {
      console.log(msgObj, fromId, toId);
      console.log(users);
      //回复客户端
      const room = users.map(e => {
        if (e.id == toId) {
          return e.room
        }
      });
      socket.to(room).emit('msg', msgObj, fromId)
    })

    //用户离开
    socket.on('disconnecting', () => {
      users.map((e,i) => {
        if (e.id == socket.name) {
          users.splice(i,1)
          console.log(socket.id + '离开');
        }
      })
    })
  });
}