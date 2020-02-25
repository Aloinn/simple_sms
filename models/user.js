// User.JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var UserSchema = new Schema({
  username : {
    type: String,
    unique: true,
    match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Please fill a valid '],
    required: true},
  password : {
    type: String,
  },
  chats : [{type:ObjectId, ref:'Chat'}]
})

var User = mongoose.model('User', UserSchema);
module.exports = User
