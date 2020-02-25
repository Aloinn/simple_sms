// HANDLE CHAT CALLS
var Room = require('../models/JS/Room');
var Message = require('../models/JS/Message');
var Chat = require('../models/Chat');
var User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');


module.exports = function (socket, io) {

  // CREATE A 1 to 1 CHAT
  socket.on('chat-start', async (other, users)=>{

    // CHECK DATABASE TO SEE IF 1-1 CHAT EXISTS ALREADY
    var chat_id;
    try{
      var my_id = connections[socket.id].id;
      var other_id = other

      // CHECK IF 1-1 CHAT EXISTS FOR USER COMBINATION
      var my_user = await User.findOne({_id:ObjectId(my_id)}).exec();
      var other_user = await User.findOne({_id:ObjectId(other_id)}).exec();
      var chat_exists = (my_user.single_chat.some(e => String(e.user) === String(other_user._id)));

      // IF EXISTS, FIND EXISTING CHAT AND LOAD
      if(chat_exists){
        for(var chat of my_user.single_chat){
          if(String(chat.user)==String(other_user._id)){
            chat_id = chat.chat._id;
            break;
          }
        }

      // CREATE NEW ENTRY FOR CONNECTIONS
      }else{
        var chat = await Chat.create({
          users: [
            ObjectId(my_id),
            ObjectId(other_id)
          ], messages: []
        })

        // ADDS NEW ENTRY FOR SINGLE CHAT
        await User.pushField(my_id, 'single_chat', {user: ObjectId(other_id), chat: ObjectId(chat._id)})

        // IF NOT SAME USER, UPDATE OTHER USER
        if(String(my_id)!=String(other_id)){
          await User.pushField(other_id, 'single_chat', {user: ObjectId(my_id), chat:ObjectId(chat._id)})
          chat_id = chat._id
        }
      }
    }catch(err){console.log(err)}

    // IF ROOM WITH CORRESPONDING MONGOOSE OBJECT EXISTs
    var room = Room.roomExists(chat_id);

    // IF ROOM CURRENTLY EXISTS
    if(room){
      userReconnect(socket.id,room,true)
    } else {
      // CREATES NEW ROOM AND CONNECTS USER
      var room = new Room(chat_id);
      userReconnect(socket.id,room,false);
    }

  })

  // JOIN GROUP CHAT
  socket.on('chat-join-group', async (chat_id)=>{
    var chat = await Chat.findOne({_id: chat_id});
    var room = Room.roomExists(chat_id);
    var late = true;
    if(!room){
      late = false;
      room = new Room(chat_id);
    }

    userReconnect(socket.id,room,late);
  })

  // START GROUP CHAT
  socket.on('chat-start-group', async (user_list)=>{

    // GROUP CHAT CREATE
    var list = []
    for(let user of user_list)
    {list.push(ObjectId(user.model_id));}

    var chat = await Chat.create({
      users: list,
      messages: []
    })
    chat_id = chat._id;
    var room = new Room(chat_id);
    // CONNECT USERS
    async.each(user_list, (user)=>{
       // FIND USER THROUGH USERLIST
       for(id in connections){
         if(String(connections[id].id)==String(user.model_id)){

           // ADD GROUPCHAT TO USER GROUPCHATS
           User.pushField(user.model_id, 'group_chat', ObjectId(chat._id))
           userReconnect(id,room, false);

          break;
         }
       }
     });

  })

  // SEND A CHAT WITH USER
  socket.on('chat-send', (content, type, roomid)=>{
    var room = Room.rooms[roomid];
    var message = new Message(content, connections[socket.id].user, type);
    room.messages.push(message);
    io.in(room.id).emit('chat-updated', {room:room});
  })
}

userReconnect = (socketid, room, late) =>{
  if(typeof connections[socketid].room != 'undefined'){
    var _rm = Room.rooms[connections[socketid].room];
    _rm.userLeave(socketid);
  }
  connections[socketid].room = room.id;
  room.userJoin(socketid);
  sockets[socketid].join(room.id);
  if(late) sockets[socketid].emit('chat-started', {room:room})
}
