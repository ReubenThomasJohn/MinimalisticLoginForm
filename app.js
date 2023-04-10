//jshint esversion:6
dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const { default: mongoose } = require('mongoose');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 8;

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

app.post('/checkEmail', function (req, res) {
  console.log(req.body.email);
  User.findOne({ email: req.body.email }, function (err, foundUser) {
    if (foundUser) {
      res.send({ validity: 'Email already exists' });
    } else {
      res.send({ validity: 'New Email' });
    }
  });
});

app.post('/register', function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    console.log(req.body.password);
    console.log(typeof hash);
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render('secrets');
      }
    });
  });
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render('secrets');
          }
        });
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
