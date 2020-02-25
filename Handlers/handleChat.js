// HANDLE CHAT CALLS
var Room = require('../models/Room');
var Chat = require('../models/Chat');
var User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (socket, io) {

  // CREATE A CHAT WITH USER
  socket.on('chat-start', async (other)=>{
  /* other is ObjectId of the other user model. */
    try{
      // ObjectIds
      var my_id = ObjectId(connections[socket.id].id);
      var other_id = other;

      // CHECK IF 1-1 CHAT EXISTS FOR USER COMBINATION
      var my_user = await User.findOne({_id:ObjectId(my_id)}).exec();
      var other_user = await User.findOne({_id:ObjectId(other_id)}).exec();
      var chat_exists = (my_user.single_chat.some(e => String(e.user) === String(other_user._id)));

      if(chat_exists){
        // FIND EXISTING CHAT
        console.log('test')
      }else{
        // CREATE NEW ENTRY FOR CONNECTIONS

        var chat = await Chat.create({
          users: [
            ObjectId(my_id),
            ObjectId(other_id)
          ],
          messages: []
        })

        // PUSH THE SINGLE CHAT FOR BOTH USERS
        User.findByIdAndUpdate(my_id,
                    {$push : { single_chat:
                        {
                          user: ObjectId(other_id),
                          chat: (chat._id)
                        }
                    }},{safe: true, upsert: true, new : true},
                    function(err, model) {if(err)throw err})

        // IF NOT SAME USER, UPDATE OTHER
        if(String(my_id)!=String(other_id)){
          User.findByIdAndUpdate(other_id,
                      {$push : { "single_chat": {
                            user: ObjectId(my_id),
                            chat: ObjectId(chat._id)
                      }}},{safe: true, upsert: true, new : true},
                      function(err, model) {if(err)throw err})
        }
        socket.emit('chat-created',{status:true, message:chat.id})
      }

    }catch(err){console.log(err);socket.emit('chat-created',{status:false, message:err})}

  })
}
