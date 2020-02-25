////////////////////
// CLIENTSIDE JS
////////////////////

var menu_auth = document.getElementById('menu-auth');
var menu_controls = document.getElementById('menu-controls');

var display_online = document.getElementById('display-online');
var socket = io();

// LOGIN RESPONSES
var err = document.getElementById('err');
socket.on('response-login', (data)=>{authResponse(data)})
socket.on('response-register', (data)=>{authResponse(data)})

function authResponse(data){
  if(data.status){
    // SAVE COOKIE AND CONNECT TO SERVICE
    document.cookie=data.message
    socket.emit('user-connected', data.user._id, data.user.username)
    menu_auth.style.display = 'none';

    // UPDATE CLIENT PANEL
  } else {err.innerHTML=data.message;}
}

// GET USERS
socket.on('update-users', (connected)=>{
  console.log(connected)
  // REMOVE CURRENT LIST OF PLAYERS
  var child = display_online.lastElementChild;
  while(child){
    display_online.removeChild(child);
    child = display_online.lastElementChild;
  }
  // RECREATE LIST OF PLAYERS
  for(socketid in connected){
    var node = document.createElement("LI");
    var text = document.createTextNode(connected[socketid].user);
    node.appendChild(text);

    var link = document.createElement("A");
    link.innerHTML="Start Chat"
    link.href = "#"
    link.addEventListener('click', ()=>{sendChat(connected[socket.id].id);});

    node.appendChild(link);

    display_online.appendChild(node)
  }

})

// CHATS
function sendChat(id){
  socket.emit('chat-start', id);
}

socket.on('chat-created', function(data) {
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
