var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var socketIO = require('socket.io');
var server = http.Server(app);
var io = socketIO(server);
var _port = process.env.PORT || 3000;

app.set('port', _port);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

    //
    //    SOCKET.IO SERVER
    //

// STARTS THE SERVER
server.listen(_port, function() {
  console.log('Starting server on port 3000');
});

// RECIEVE MESSAGES FROM SERVER (DEBUG)
io.on('connection', function(socket){

  connections[socket.id] = {
    room: undefined,
    user: undefined
  }
  socket.emit('message',"Good connection!")


  // ON DISCONNECT
  socket.on('disconnect', function(){
    /*
    var _room = connections[socket.id].room
    if(_room!= undefined){
      _room.leave(socket.id)
      _room.updateConnected();
    }*/
    delete connections[socket.id]
  });
})
