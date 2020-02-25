// HANDLE USER CALLS

// HANDLE ROOM
var Room = require('/app/models/JS/Room');
var User = require('/app/models/User');

module.exports = function (socket, io) {

  // ON USER SUCCESSFULLY AUTH AND CONNECTED
  socket.on('user-connected', async (user_id, user_name)=>{

    // CREATE NEW ENTRY FOR CONNECTIONS
    connections[socket.id] = {
      room:undefined,
      user:user_name,
      id:user_id,
    }
    sockets[socket.id] = socket;

    // UPDATES ALL USERS CONNECTIONS LIST
    io.emit('update-users', connections);
    var user = await User.findOne({_id: user_id})
                          .populate({path: 'group_chat', populate:{path: 'users', select: 'username', model:'User'}})
                          .populate({path: 'single_chat.user', select: 'username', model: 'User'})
                          .exec();
    user.password="";
    socket.emit('update-user', user);
  })

  // GET ALL CONNECTED USERS
  socket.on('user-list', ()=>{
    socket.broadcast('updat')
  })

  // ON USER DISCONNECT
  socket.on('disconnect', async function(){
    var room;
    if(typeof connections[socket.id]!='undefined')
    {room = Room.rooms[connections[socket.id].room];}
    if(typeof room != 'undefined'){
      await room.userLeave(socket.id)
    }
    delete connections[socket.id];
    delete sockets[socket.id];

    // UPDATES ALL USERS CONNECTIONS LIST
    io.emit('update-users', connections)
  });
}
