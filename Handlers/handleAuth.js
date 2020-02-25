// DEPENDENCIES
const config = process.env;
const jwt = require('jsonwebtoken');
const Crypto = require('crypto');
const User = require(__dirname +'/models/user');

// HANDLE AUTHENTICATION CALLS
module.exports = function (socket) {

  // WHEN USER LOGINS
  socket.on('login', async (data)=>{

    // CHECK IF REQUEST SENT FROM LEGIT SOURCE
    try{
      // ASYNC
      if(data.csrf_key!=config.csrf_key) throw 'Invalid CSRF!'
      var user = await User.findOne({ 'username' : data.username}).exec();
      if (user==undefined) throw 'User does not exist';
      if (!verifyPasswords(user.password, data.password)) throw 'Invalid password';

      // USER AUTHENTICATED!
      var token = jwt.sign({data: user._id}, config.secret, { expiresIn: '1h'})
      socket.emit('response-login', {status:true, message:token, user:user});

    }catch(err){ socket.emit('response-login', {status:false, message:err})}
  });

  // WHEN USER REGISTERS
  socket.on('register', async (data)=>{
    try{

      // ASYNC GET USER
      if(data.csrf_key!=config.csrf_key) throw 'Invalid CSRF!';
      try{
        var user = await User.create({
          username: data.username,
          password: hash(data.password),
          single_chat: [],
          group_chat: [],
        })
      } catch(err){throw "Username already taken!"}

      // USER REGISTERED!
      var token = jwt.sign({data: user._id}, config.secret, { expiresIn: '1h'})
      socket.emit('response-register', {status:true, message:token, user:user});

    }catch(err){ console.log(err); socket.emit('response-register', {status:false, message:err})}

  });
};

// HELPER FUNCTIONS
function hash(password){
  let salt = Crypto.randomBytes(16).toString('base64')
  let hash = Crypto.createHmac('sha512',salt).update(password).digest("base64");
  let _password = salt + "$" + hash;
  return _password
}

function verifyPasswords(password1, password2){
  let passwordFields = password1.split('$');
  let salt = passwordFields[0];
  let old_hash = passwordFields[1];

  return(Crypto.createHmac('sha512',salt).update(password2).digest("base64")==old_hash);
}
