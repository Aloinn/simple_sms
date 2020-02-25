// HANDLE USER CALLS

// HANDLE ROOM
var Room = require('../models/Room');

module.exports = function (socket) {

  // ON USER SUCCESSFULLY AUTH AND CONNECTED
  socket.on('user-connected', (name)=>{

    // CREATE NEW ENTRY FOR CONNECTIONS
    connections[socket.id] = {
      room:undefined,
      user:name
    }
  })

  // GET ALL CONNECTED USERS
  socket.on('user-list', ()=>{
    return connections
  })

  // ON USER DISCONNECT
  socket.on('disconnect', function(){
    var room;
    if(typeof connections[socket.id]!='undefined')
    {room = Room.rooms[connections[socket.id].room]}
    if(typeof room != 'undefined'){room.userLeave(socket.id)}
    delete connections[socket.id]
  });
}
