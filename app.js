var express = require('express');
var db = require('./db');
var app = express();
var cors = require('cors');
var port = process.env.PORT || 3001;

app.use(express.static('public'))
app.use(cors());
app.set('view engine', 'ejs');

var UserController = require('./User/UserController');
var ChatController = requre('./Chat/ChatController')
app.use('/users', UserController)

var server = app.listen(port, function(){
  console.log('Express server listening on port ' + port);
})

/*
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

  // ON DISCONNECT
  socket.on('disconnect', function(){
    var room = Room.rooms[connections[socket.id].room]
    if(typeof room != 'undefined'){room.userLeave(socket.id)}
    delete connections[socket.id]
  });

})
*/
