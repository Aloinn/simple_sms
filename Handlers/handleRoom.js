// HANDLE ROOM
var Room = require('../models/Room');

module.exports = function (socket) {

  // ON ROOM CREATE
  socket.on('room-create', ()=>{
    var room = new Room();
    socket.emit('response-room-created', room.id)
  })

  // ON ROOM JOINS
  socket.on('room-join', (roomid)=>{
    var room = Room.rooms[roomid]

    if(typeof room==='undefined')
    {res={status:false, message:"Room does not exist"}}

    else if(room.checkFull())
    {res={status:false, message:"Room is full"}}

    else
    {res={status:true, message:"Room joined successfully!"}}

    if(res.status){
      room.userJoin(socket.id);
      connections[socket.id].room = room.id;
    }
    socket.emit('response-room-joined', res)
  })

  // ON ROOM LEAVE
  socket.on('room-leave', ()=>{
    var room = Room.rooms[connections[socket.id].room]
    room.userLeave(socket.id);
  })

  //
  //      ROOM GETS
  //

  // GET ROOM LIST
  socket.on('room-list', ()=>{socket.emit('response-room-list', Room.rooms); console.log(Room.rooms);})

  // GET USER'S ROOM DETAILS
  socket.on('room-detail', ()=>{socket.emit('response-room-detail', Room.rooms[connections[socket.id].room])})
};
