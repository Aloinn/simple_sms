// db.js
var mongoose = require('mongoose');
var config = require('./config.js')
mongoose.connect(config.mongoDB, {useNewUrlParser: true, useUnifiedTopology:true})
