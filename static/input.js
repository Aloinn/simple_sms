var currentRoom = "test";
var currentPlayers;

var main = document.getElementById('menu-info');

function createRoom(roomid){
  console.log(roomid)
};

function joinRoom(roomid){
  update();
};

function update(){
  main.innerHTML = currentRoom;
}
