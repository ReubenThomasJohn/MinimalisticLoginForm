//jshint esversion:6

require('./config/db');

dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');

const session = require('express-session');
const passport = require('passport');

const UserRouter = require('./api/User');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', UserRouter);

const PORT = process.env.PORT;

app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});

// app.post('/register', function (req, res) {
//   User.register(
//     { username: req.body.username },
//     req.body.password,
//     function (err, user) {
//       if (err) {
//         console.log(err);
//         res.redirect('/register');
//       } else {
//         console.log(user);
//         passport.authenticate('local')(req, res, function () {
//           console.log('Local Strategy');
//           res.redirect('/secrets');
//         });
//       }
//     }
//   );
// });

// app.post('/login', function (req, res) {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.password,
//   });

//   req.login(user, function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate('local')(req, res, function () {
//         res.redirect('/secrets');
//       });
//     }
//   });
// });
