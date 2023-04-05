//jshint esversion:6
dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const { default: mongoose } = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extendedd: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET;

const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});

app.get('/logout', function (req, res) {
  res.render('home');
});

app.listen(3001, function () {
  console.log('Server running on port 3001');
});
