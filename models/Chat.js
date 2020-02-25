// Chat.JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var ChatSchema = new Schema({
  users : [{type:ObjectId, ref:'User'}],
  messages : [{type:ObjectId, ref:'Messages'}],
})

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat
