// DEPENDENCIES
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();

// CREATING SERVER
var server = http.Server(app);
var io = socketIO(server);
var _port = process.env.PORT || 3000;

// SETTING PORTS
app.set('port', _port);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

// MODELS
var Room = require('./models/room');

//
//    SOCKET.IO SERVER
//

// STARTS THE SERVER
server.listen(_port, function() {
  console.log('Starting server on port 3000');
});

// SERVER VARIABLES
connections = {};

io.on('connection', function(socket){

  // LIST OF CONNECTIONS
  connections[socket.id] = {
    room: undefined,
    user: undefined
  }

  //
  //      ROOM METHODS
  //

  // ON ROOM CREATE
  socket.on('room-create', ()=>{
    var room = new Room();
    Room.userJoin(socket.id);
    connections[socket.id].room = room.id;
    socket.emit('response-room-created', room.id)
  })

  // ON ROOM JOINS
  socket.on('room-join', (roomid)=>{
    var room = Room.rooms[room]

    if(typeof room==='undefined')
    {res={status:false, message:"Room does not exist"}}

    else if(room.checkFull())
    {res={status:false, message:"Room is full"}}

    else
    {res={status:true, message:"Room joined successfully!"}}

    socket.emit('response-room-joined', res)
  })

  // ON ROOM LEAVE
  socket.on('room-leave', ()=>{
    var room = connections[socket.id].room;
    room.userLeave(socket.id);
  })

  //
  //      ROOM GETS
  //

  // GET ROOM LIST
  socket.on('room-list', ()=>{socket.emit('response-room-list', Room.rooms)})

  // GET USER'S ROOM DETAILS
  socket.on('room-detail', ()=>{socket.emit('response-room-detail', Room.rooms[connections[socket.id].room])})

  // ON DISCONNECT
  socket.on('disconnect', function(){
    var room = connections[socket.id].room
    if(room != undefined){room.userLeave(socket.id)}
    delete connections[socket.id]
  });

})
