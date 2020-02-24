////////////////////
// CLIENTSIDE JS
////////////////////

var socket = io();
socket.emit('message','I joined!')
socket.on('response', function(data) {
  console.log(data);
});
