////////////////////
// CLIENTSIDE JS
////////////////////

var socket = io();
socket.emit('message','I joined!')

socket.on('message', function(data) {
  console.log(data);
});
