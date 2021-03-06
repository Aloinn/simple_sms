// MONGOOSE CLASSES
var Chat = require('/app/models/Chat');
var Message = require('/app/models/Message');
var ObjectId = require('mongoose').Types.ObjectId;
var app = require('/app/app');
var async = require('async');

// JAVASCRIPT MESSAGE CLASS
var Message_JS = require('/app/models/JS/Message');

// ROOM CLASS
class Room{

  // CONSTRUCTOR FOR ROOM INSTANCE
  constructor(chat_id){
    this.id = Room.createCode();
    Room.roomAdd(this.id, this);
    this.usersmax = 10;
    this.users = [];
    this.oldmessages = [];
    this.messages = [];

    // GREET
    var message = new Message_JS('Room created', this.id, "text");
    this.oldmessages.push(message)

    // CHECK IF ROOM EXISTS
    this._id = chat_id
    this.load();
  }

  // USER JOINS ROOM
  userJoin(socketid){
    // CHECKS IF USER ALREADY EXISTS
    if(!this.users.some((e)=>e==socketid)) this.users.push(socketid);
  }

  // ASYNC SAVE/LOAD
  async load(){
    try{
      var chat = await Chat.findOne({_id: ObjectId(this._id)})
                .populate({path: 'messages', model: 'Message'})
                .exec();
      if (chat==undefined) throw 'Chat does not exist';
      for(var i in chat.messages){
        var message = chat.messages[i]

        var _message = new Message_JS(message.content, message.user, message.type, message.date);
        this.oldmessages.push(_message)
      }
    }catch(err){console.log('test',err);}

    app.io.in(this.id).emit('chat-started', {room:this});
  }

  async save(){
    try{
    async.eachSeries(this.messages, async (message)=>{
      var _message = await Message.create({
        user: message.sender,
        content: message.content,
        type: message.type,
        date: message.date,
      })

      var chat =  Chat.findByIdAndUpdate(this._id,
                  {$push : { messages: ObjectId(_message._id)}},
                  {safe: true, upsert: true, new : true},
                  function(err, model) {if(err)throw err;})
    })}catch(err){console.log(err)}
  }
  // USER LEAVES ROOM
  async userLeave(socketid){

    // ITERATES ALL CONNECTED USERS AND FINDS THE ONE LEAVING
    for(let i in this.users){
      if(this.users[i] === socketid){
        this.users.splice(i,1)
        break;
      }
    }

    // DELETES ROOM IF EMPTY OTHERWISE UPDATES
    if(this.users.length==0){

      // SAVE ROOM BEFORE DELETION
      await this.save();
      Room.roomRemove(this.id)
    }
  }

        //
        //    HELPER FUNCTIONS
        //

  // CREATES A UNIQUE IDENTIFIER FOR ROOM
  static createCode(){

    // CREATE 4 DIGIT CODE
    function makeID(){
      var code = ""
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < 4; i++){code += possible.charAt(Math.floor(Math.random() * possible.length))};
      return code;
    }

    // VALIDATE UNIQUENESS OF CODE
    while(true){
      var id = makeID();
      if(typeof Room.rooms[id]==='undefined'){return id}
    }
  }

  // INSTANCE FUNCTIONS
  checkFull(){return this.users==this.usersmax}

  // STATIC FUNCTIONS
  static roomAdd(roomid, room){Room.rooms[roomid]=room}
  static roomRemove(roomid)   {delete(Room.rooms[roomid])}
  static roomExists(chat_id)  {
    for(let id in Room.rooms){
      var room = Room.rooms[id]
      if(String(room._id)==String(chat_id)){return room}
    } return false
  }
}

Room.rooms = {};

module.exports = Room;
