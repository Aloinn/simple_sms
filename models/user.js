class User{
  static rooms = [];
  
  // CONSTRUCTOR FOR ROOM INSTANCE
  constructor(){
    Room.rooms.push(this.id);
    this.id = Room.createCode();
    this.usersmax = 10;
    this.users = [];
  }
}

module.exports = User;
