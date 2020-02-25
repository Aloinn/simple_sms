// HANDLE CHAT CALLS
var Room = require('../models/JS/Room');
var Message = require('../models/JS/Message');
var Chat = require('../models/Chat');
var User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (socket, io) {

  // CREATE A CHAT WITH USER
  socket.on('chat-start', async (other, users)=>{

    // CHECK DATABASE TO SEE IF CHAT EXISTS
    var chat_id;
    try{

      // 1-1 CHATS
      if(users<=2){
        var my_id = connections[socket.id].id;
        var other_id = other

        // CHECK IF 1-1 CHAT EXISTS FOR USER COMBINATION
        var my_user = await User.findOne({_id:ObjectId(my_id)}).exec();
        var other_user = await User.findOne({_id:ObjectId(other_id)}).exec();
        var chat_exists = (my_user.single_chat.some(e => String(e.user) === String(other_user._id)));

        if(chat_exists){
          // FIND EXISTING CHAT AND LOAD
          for(var chat of my_user.single_chat){
            if(String(chat.user)==String(other_user._id)){
              chat_id = chat.chat._id;
              break;
            }
          }
        }else{
          // CREATE NEW ENTRY FOR CONNECTIONS

          var chat = await Chat.create({
            users: [
              ObjectId(my_id),
              ObjectId(other_id)
            ], messages: []
          })

          // PUSH THE SINGLE CHAT FOR BOTH USERS
          User.findByIdAndUpdate(my_id,
                      {$push : { single_chat:
                          {
                            user: ObjectId(other_id),
                            chat: ObjectId(chat._id)
                          }
                      }},{safe: true, upsert: true, new : true},
                      function(err, model) {if(err)throw err})

          // IF NOT SAME USER, UPDATE OTHER
          if(String(my_id)!=String(other_id)){
            User.findByIdAndUpdate(other_id,
                        {$push : { single_chat:
                        {
                            user: ObjectId(my_id),
                            chat: ObjectId(chat._id)
                          }
                        }},{safe: true, upsert: true, new : true},
                        function(err, model) {if(err)throw err})
          }
          chat_id = chat._id
        }
      }
    }catch(err){console.log(err)}

    // CREATES NEW ROOM AND CONNECTS USER
    var room = new Room(chat_id, ()=>{io.in(room.id).emit('chat-started', {room:room});});
    connections[socket.id].room = room.id;
    room.userJoin(socket.id);
    socket.join(room.id);

    // FIND THE OTHER USER THROUGH CONNECTED LIST THEN CONNECTS
    for(id in connections){
      if(String(connections[id].id)==String(other)){
        if(connections[id].room==room.id)
        connections[id].room = room.id;
        room.userJoin(id);
        sockets[id].join(room.id);
        break;
      }
    }

    // START
    var message = new Message('Room created', room.id, "text");
    room.oldmessages.push(message)
    //io.in(room.id).emit('chat-started', {room:room});
  })

  // SEND A CHAT WITH USER
  socket.on('chat-send', (text, type, roomid)=>{
    var room = Room.rooms[roomid];
    var message = new Message(text, connections[socket.id].user, type);
    room.messages.push(message);
    io.in(room.id).emit('chat-updated', {room:room});
  })
}
