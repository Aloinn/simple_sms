// MONGOOSE CLASSES
var Chat = require('../Chat')
var Message = require('../Message')
var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

// JAVASCRIPT MESSAGE CLASS
var Message_JS = require('./Message');

// ROOM CLASS
class Room{

  // CONSTRUCTOR FOR ROOM INSTANCE
  constructor(chat_id, callback){
    this.id = Room.createCode();
    Room.roomAdd(this.id, this);
    this.usersmax = 10;
    this.users = [];
    this.oldmessages = [];
    this.messages = [];

    // CHECK IF ROOM EXISTS
    this._id = chat_id
    this.load(callback);
  }

  // USER JOINS ROOM
  userJoin(socketid){
    // CHECKS IF USER ALREADY EXISTS
    if(!this.users.some((e)=>e==socketid)) this.users.push(socketid);
  }

  // ASYNC SAVE/LOAD
  async load(callback){
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
    }catch(err){console.log(err);return callback()}
    callback();
  }

  async save(){
    try{
    async.eachSeries(this.messages, async (message)=>{
      console.log(message)
      var _message = await Message.create({
        user: message.sender,
        content: message.content,
        type: message.type,
        date: message.date,
      })

      console.log("sav_")
      var chat =  Chat.findByIdAndUpdate(this._id,
                  {$push : { messages: ObjectId(_message._id)}},
                  {safe: true, upsert: true, new : true},
                  function(err, model) {if(err)throw err;console.log("good");})
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

      console.log('saving')
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
  // INSTANCE
  checkFull(){return this.users==this.usersmax}
  // STATIC
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
