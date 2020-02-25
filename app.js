// DEPENDENCIES

var express = require('express');
var db = require('./db');
var app = express();
var cors = require('cors');
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3001;

// EXPRESS JS CONNECTION

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');

var server = app.listen(port, function()
{console.log('Express server listening on port ' + port);})

app.get('/', function(req, res){res.sendFile(path.join(__dirname, 'index.html'));});

// MODULES
var handleAuth = require('./Handlers/handleAuth');
var handleUser = require('./Handlers/handleUser');
var handleChat = require('./Handlers/handleChat');

// SERVER VARIABLES
connections = {};
sockets = {};

// SOCKET.IO CONNECTION
var socketIO = require('socket.io');
var io = socketIO(server);

io.on('connection', function(socket){
  handleAuth(socket);
  handleUser(socket, io);
  handleChat(socket, io);

})

module.exports.io = io;
