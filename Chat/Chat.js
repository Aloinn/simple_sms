// Chat.JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var ChatSchema = new Schema({
  users : [{type:ObjectId, ref:'User'}],
  username : {
    type: String,
    unique: true,
    match: [/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Please fill a valid '],
    required: true},
  password : {
    type: String,
  }
})

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat
