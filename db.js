// db.js
var mongoose = require('mongoose');
var config = require('./config.js')
mongoose.connect(config.mongoDB, {useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology:true})
