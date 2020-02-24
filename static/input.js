var currentRoom = "test";
var currentPlayers;

var main = document.getElementById('menu-info');

function createRoom(){
  socket.emit('room-create')
};

function joinRoom(roomid){
  socket.emit('room-join', roomid)
};

function leaveRoom(){
  socket.emit('room-leave');
}

function update(){
  main.innerHTML = currentRoom;
}

function details(){
  socket.emit('room-list');
}
