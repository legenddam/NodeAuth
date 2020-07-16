var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: './uploads/' }) //Handule Uploads

var User = require('../models/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {title : 'Login'});
});


router.post('/login', passport.authenticate('local', {failureFlash : 'Invalid Username or Password', failureRedirect : '/users/login'}), function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    req.flash('success', 'You are now in loggedin');
    res.redirect('/');
});

passport.use(new LocalStrategy(function(username, password, done){
  console.log('passport');
  User.getUserbyUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message : 'Incorrect UserName'})
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      console.log(isMatch);
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false, {message : 'Incorrect Password'});
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserbyId(id, function(err, user) {
    done(err, user);
  });
});

const { body, validationResult } = require('express-validator');

router.post('/register', upload.single('profileimage'),
  [
    body('name', 'The Name is required').not().isEmpty(),
    body('email', 'Email is required.').not().isEmpty(),
    body('email', 'Email is not valid').isEmail(),
    body('username', 'Username is required').not().isEmpty(),
    body('password', 'Password is required').not().isEmpty(),
    body('password2', 'Password does not Match').not().equals(body.password)
  ],
  function(req, res, next){
    
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  if(req.file)
  {
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  }else{
    console.log('No File Uploaded');
    var profileimage = 'noImage.jpeg';
  }
  console.log(profileimage);
  //Check Errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    console.log('Error');
    res.render('register', { errors: errors.array()});
  }
  else{
    console.log('No Errors');
    var newUser = new user({
      name : name,
      email : email,
      username : username,
      password : password,
      profileimage : profileimage
    });
    
    req.flash('success','You are now sucecssfully registered and can log in');

    User.createUser(newUser, function(err, user){
      if(err){
        throw err;
      }
      console.log(user);

    });
    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;