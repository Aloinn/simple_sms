// Message.JS
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var MessageSchema = new Schema({
  user : {type:String},
  content : {type:String},
  type : {type:String},   // IMAGE, TEXT, DOCUMENT
  date : { type : Date, default: Date.now }
})

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message
