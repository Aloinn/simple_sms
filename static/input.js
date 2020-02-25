var currentRoom = "test";
var currentPlayers;
var csrf = "TEST"

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

// CHATS
function startChat(socketid){
  socket.emit('chat-create');
}
// OTHERS
var main = document.getElementById('menu-info');

function createRoom(){socket.emit('room-create')};
function joinRoom(roomid){socket.emit('room-join', roomid)};
function leaveRoom(){socket.emit('room-leave');}
function update(){main.innerHTML = currentRoom;}
function details(){socket.emit('room-list');}
