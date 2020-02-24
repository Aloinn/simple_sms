class Room{

  static rooms = [];

  // CONSTRUCTOR FOR ROOM INSTANCE
  constructor(){
    Room.rooms.push(this.id);
    this.id = Room.createCode();
    this.usersmax = 10;
    this.users = [];
  }

  //
  //  USER BASED FUNCTIONS
  //

  // USER JOINS ROOM
  userJoin(id){
    this.users.push(id);
    this.updateConnected();
  }

  // USER LEAVES ROOM
  userLeave(id){
    // ITERATES ALL CONNECTED USERS AND FINDS THE ONE LEAVING
    for(let i in this.users){
      if(this.users[i].socketid ==id){
        this.users.pop(i)
        break;
      }
    }
    this.updateConnected();
  }

  // UPDATES ALL USERS CONNECTED TO ROOM
  updateConnected(){
    //io.sockets.in(this.id).emit()
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
      console.log(code)
      return code;
    }

    // VALIDATE UNIQUENESS OF CODE
    while(true){
      var id = makeID();
      if(typeof Room.rooms==='undefined'){return id}
    }
  }

}

module.exports = Room;
