// HANDLE CHAT CALLS
var Room = require('../models/Room');
var Chat = require('../models/Chat');

module.exports = function (socket, io) {

  // CREATE A CHAT
  socket.on('chat-create', async (other)=>{

    // CREATE NEW ENTRY FOR CONNECTIONS
    var chat = await Chat.create({
      users: [
        connections[socket.id].user_id,
        connections[other].user_id
      ]
    })

    // UPDATES ALL USERS CONNECTIONS LIST
    io.emit('update-users', connections)
  })
}
