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
  // ARRAY OF GROUPCHATS
  group_chat: [{type:ObjectId, ref:'Chat'}],
  // ARRAY OF SINGLECHATS
  single_chat: [{
    user:{type:ObjectId, ref:'User'},
    chat:{type:ObjectId, ref:'Chat'},
    _id : false
  }]
})

var User = mongoose.model('User', UserSchema);
module.exports = User