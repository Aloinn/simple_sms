var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../config');
const Crypto = require('crypto')
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
var User = require('./User')

// CREATE NEW USER
router.post('/register', (req, res)=>{
  if(req.body.csrf_key != config.csrf_key){return res.status(400).send('Invalid CSRF!')}
  let salt = Crypto.randomBytes(16).toString('base64')
  let hash = Crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
  let password = salt + "$" + hash;
  req.body.password = password;

  User.create({
    username  : req.body.username,
    password  : req.body.password,
  },(err, user)=>{
    if(err){return res.status(500).send("The username has already been taken!")}
    // USER AUTHENTICATED!
    var token = jwt.sign({data: user._id}, config.secret, { expiresIn: '1h'})
    res.status(200).send(token);
  });
});

// LOGIN
router.post('/login', (req, res)=>{
  console.log(req.body)
  User.findOne({ 'username' : req.body.username}, (err, user)=>{
    if(req.body.csrf_key != config.csrf_key){return res.status(400).send('Invalid CSRF!')}
    if(err){return res.status(500).send('Server error')}
    if(!user){return res.status(404).send('No users exist with credentials')}


    // Getting old password
    let passwordFields = user.password.split('$');
    let salt = passwordFields[0];
    let old_hash = passwordFields[1];

    let new_hash = Crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");

    /// CHECKING PASSWORDS
    if(new_hash===old_hash){

      // USER AUTHENTICATED!
      var token = jwt.sign({data: user._id}, config.secret, { expiresIn: '1h'})
      res.status(200).send(token);
    } else {
      // USER NOT AUTHENTICATED
      return res.status(401).send('Invalid password!')
    }
  })
})

module.exports = router;
