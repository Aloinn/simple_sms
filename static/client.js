////////////////////
// CLIENTSIDE JS
////////////////////

var menu_auth = document.getElementById('menu-auth');
var menu_controls = document.getElementById('menu-controls');

var display_online = document.getElementById('display-online');
var socket = io();

//
//  AUTH
//

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

// AUTH
function login(){
  var username = document.getElementById('login-username').value;
  var password = document.getElementById('login-password').value;
  socket.emit('login', {username: username, password: password, csrf_key:csrf});
}

function register(){
  var username = document.getElementById('register-username').value;
  var password1 = document.getElementById('register-password1').value;
  var password2 = document.getElementById('register-password2').value;
  if(password1==password2){
    socket.emit('register', {username:username, password:password1, csrf_key:csrf});
  }else{
    console.log("Passwords dont match!")
  }
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
  for(id in connected){

    var node = document.createElement("LI");
    node.innerHTML= connected[id].user+' <a href="#" onClick="sendChat(\''+connected[id].id+'\')">chat</a>'
    display_online.appendChild(node)
  }

})

// CHATS
function sendChat(id){
  socket.emit('chat-start', id);
}

function startChat(socketid){socket.emit('chat-start', socketid);}

socket.on('chat-started', function(data) {
  console.log(data);
});
var csrf = "TEST"



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
