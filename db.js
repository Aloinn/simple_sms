// db.js
var mongoose = require('mongoose');
mongoose.connect(ENV['mongoDB'], {useFindAndModify: false,useNewUrlParser: true, useUnifiedTopology:true})
