////////////////////
// CLIENTSIDE JS
////////////////////
app = {
  user: undefined,
  chat: undefined,
  room: undefined,
  chatlist: [],
}
var menu_auth = document.getElementById('menu-auth');
var menu_controls = document.getElementById('menu-controls');

var display_online = document.getElementById('display-online');
var display_chat = document.getElementById('display-chat');
var display_chats = document.getElementById('display-chats');
var display_chatlist = document.getElementById('display-chatlist');

var chat_content = document.getElementById('chat-content');
var socket = io();

var csrf = "TEST"

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

  // REMOVE CURRENT LIST OF PLAYERS
  var child = display_online.lastElementChild;
  while(child){
    display_online.removeChild(child);
    child = display_online.lastElementChild;
  }

  // RECREATE LIST OF PLAYERS
  for(id in connected){
    var node = document.createElement("LI");
    node.innerHTML= connected[id].user
    if(id!=socket.id){
      node.innerHTML+=
      '\t \t<a href="#" onClick="startChat(\''+connected[id].id+'\')">chat</a>'+
      '\t \t<a href="#" onClick="addToChat(\''+connected[id].id+'\', \''+ connected[id].user+'\')">add to group</a>'
    }display_online.appendChild(node)
  }

})

// GET CHATS
socket.on('update-user', (user)=>{
  console.log(user);
  app.user = user;
  updateChats();
})

// CHATS
function startChat(socketid){socket.emit('chat-start', socketid, 2);}
function sendChat(text){socket.emit('chat-send', text, "text", app.room)}
function addToChat(model_id, name){
  if(!app.chatlist.some((e)=>e==model_id)){
    app.chatlist.push({model_id:model_id,name:name})
    updateGroupChatList();
  }
}
function removeFromChat(model_id){
  for(var i in app.chatlist){
    if(app.chatlist[i].model_id==model_id){
      app.chatlist.splice(i,1)
      updateGroupChatList();
      break;
    }
  }
}
function startGroupChat(){
  app.chatlist.push({model_id: app.user._id, name:"self"});
  socket.emit('chat-start-group', app.chatlist, app.chatlist.length);
}
function joinGroupChat(chat_id){
  socket.emit('chat-join-group', chat_id)
}

function updateChats(){
  // REMOVE CURRENT LIST OF CHATS
  var child = display_chatlist.lastElementChild;
  while(child){
    display_chats.removeChild(child);
    child = display_chats.lastElementChild;
  }

  // ADD NODES FOR SINGLE CHATS
  for(user of app.user.single_chat){
    var node = document.createElement("LI");
    node.innerHTML=
    '\t \t<a href="#" onClick="startChat(\''+user.user._id+'\')">'+user.user.username+'</a>';
    display_chats.append(node)
  }

  // ADD NODES FOR GROUP CHATS
  for(group_chat of app.user.group_chat){
    var node = document.createElement("LI");
    var name = ""
    for(user of group_chat.users){
      name+= user.username +", "
    }
    node.innerHTML=
    '\t \t<a href="#" onClick="joinGroupChat(\''+group_chat._id+'\')">'+name+'\'</a>';
    display_chats.append(node)
  }
}

// UPDATE FRONTEND CHATLIST
function updateGroupChatList(){

  // REMOVE CURRENT LIST OF CHATLIST PLAYERS
  var child = display_chatlist.lastElementChild;
  while(child){
    display_chatlist.removeChild(child);
    child = display_chatlist.lastElementChild;
  }

  // ADD ALL NODES
  for(i of app.chatlist){
    var node = document.createElement("LI");
    node.innerHTML= i.name+
    '\t \t<a href="#" onClick="removeFromChat(\''+i.model_id+'\')">remove</a>';
    display_chatlist.append(node)
  }
}

// IF CHAT STARTS
socket.on('chat-started', (data)=>{
  var chat = data.room;
  app.room = chat.id;
  console.log(data)

  // LOAD OLD MESSAGES
  for(message of chat.oldmessages){
    var node = document.createElement("LI");
    node.innerHTML= message.sender+": "+message.content
    chat_content.appendChild(node)
  }

  // LOAD NEW MESSAGES
  for(message of chat.messages){
    var node = document.createElement("LI");
    node.innerHTML= message.sender+": "+message.content
    chat_content.appendChild(node)
  }
})

socket.on('chat-updated', (data)=>{
  var chat = data.room;
  var message = chat.messages.pop();
  var node = document.createElement("LI");
  node.innerHTML = message.sender+": "+message.content;
  chat_content.appendChild(node);
})
