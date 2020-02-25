// HANDLE USER CALLS

// HANDLE ROOM
var Room = require('../models/JS/Room');

module.exports = function (socket, io) {

  // ON USER SUCCESSFULLY AUTH AND CONNECTED
  socket.on('user-connected', (user_id, user_name)=>{

    // CREATE NEW ENTRY FOR CONNECTIONS
    connections[socket.id] = {
      room:undefined,
      user:user_name,
      id:user_id,
    }
    sockets[socket.id] = socket;

    // UPDATES ALL USERS CONNECTIONS LIST
    io.emit('update-users', connections)
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