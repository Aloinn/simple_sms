////////////////////
// CLIENTSIDE JS
////////////////////

var menu_auth = document.getElementById('menu-auth');
var menu_controls = document.getElementById('menu-controls');
var socket = io();

// LOGIN RESPONSES
var err = document.getElementById('err');
socket.on('login-response', (data)=>{authResponse(data)})
socket.on('register-response', (data)=>{authResponse(data)})

function authResponse(data){
  if(data.status){
    document.cookie=data.message
    socket.emit('user-connected', data.name)
    menu_auth.style.display = 'none';
  } else {err.innerHTML=data.message;}
}


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
