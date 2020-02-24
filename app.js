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

  // ON GOOD CONNECTION
  socket.emit('message',connections)

  // ROOM METHODS

  // ON ROOM CREATE
  socket.on('room-create', ()=>{
    var room = new Room();
    Room.userJoin(socket.id);
  })

  // ON DISCONNECT
  socket.on('disconnect', function(){
    var room = connections[socket.id].room
    if(room != undefined){room.userLeave(socket.id)}
    delete connections[socket.id]
  });

})
