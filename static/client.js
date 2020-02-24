////////////////////
// CLIENTSIDE JS
////////////////////

var socket = io();
socket.emit('message','I joined!')

socket.on('response', function(data) {
  console.log(data);
});

// RESPONSE
socket.on('response-room-created', function(data) {
  socket.emit('room-join', data)
  console.log(data);
});
socket.on('response-room-joined', function(data) {
  console.log(data);
});
socket.on('response-room-detail', function(data) {
  console.log(data);
});
socket.on('response-room-list', function(data) {
  console.log(data);
});
