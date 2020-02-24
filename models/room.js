class Room{

  // CONSTRUCTOR FOR ROOM INSTANCE
  constructor(){
    this.id = Room.createCode();
    Room.roomAdd(this.id, this);
    this.usersmax = 10;
    this.users = [];
  }

  //
  //  USER BASED FUNCTIONS
  //

  // USER JOINS ROOM
  userJoin(socketid){this.users.push(socketid);}

  // USER LEAVES ROOM
  userLeave(socketid){
    // ITERATES ALL CONNECTED USERS AND FINDS THE ONE LEAVING
    for(let i in this.users){
      console.log(socketid, this.users[i])
      if(this.users[i] === socketid){
        this.users.splice(i,1)
        break;
      }
    }
    // DELETES ROOM IF EMPTY OTHERWISE UPDATES
    if(this.users.length==0)
    {Room.roomRemove(this.id)}
  }

  // UPDATES ALL USERS CONNECTED TO ROOM
  updateConnected(io){
    io.sockets.in(this.id).emit("message", this.users)
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
}
Room.rooms = {};

module.exports = Room;
