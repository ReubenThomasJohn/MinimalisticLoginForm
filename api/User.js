const express = require('express');
const router = express.Router();

// mongodb user model
const { UserSchema, User } = require('./../models/User');

// mongodb user verification model
const {
  UserVerificationSchema,
  UserVerification,
} = require('./../models/UserVerification');

// email handler
const nodemailer = require('nodemailer');

// unique string
const { v4: uuidv4 } = require('uuid');

// env variables
require('dotenv').config();

// Password handler
const bcrypt = require('bcrypt');

// path for static verified page
const path = require('path');

// nodemailer stuff
let transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready for messages');
    console.log(success);
  }
});

// send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in the email
  const currentUrl = `http://localhost:${process.env.PORT}/`;

  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `<p> Verify your email address to complete the signup and login to your account</p>
             <p>This link <b>expires in 6 hours</b>.</p>
             <p>Press <a href=${
               currentUrl + 'user/verify/' + _id + '/' + uniqueString
             }>here</a> to proceed.</p>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      // set values in userVerification collection
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification
        .save()
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              // email sent and verification record saved
              res.json({
                status: 'PENDING',
                message: 'Verification email sent!',
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: 'FAILED',
                message: 'Verification email failed',
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: 'FAILED',
            message: "Couldn't saved verification email data!",
          });
        });
    })
    .catch(() => {
      res.json({
        status: 'FAILED',
        message: 'An error occurred while hashing email data',
      });
    });
};

//verify email
router.get('/verify/:userId/:uniqueString', (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        // user verification record exists so we proceed

        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;

        // checking for expired unique string
        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          UserVerification.deleteOne({ userId })
            .then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = 'Link has expired. Please sign up again.';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  let message =
                    'Clearing user with expired unique string failed';
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                'An error occurred while clearing expired user verification record';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          // user verification record exists so we validate the user string
          // First compare the hashed unique string

          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                // string is valid
                User.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, './../views/verified.html')
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          'Error occurred while finalizing successful verification';
                        res.redirect(
                          `/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      'An error occurred while updating user record to show verified.';
                    res.redirect(
                      `/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                // existing record but incorrent verification details passed.
                let message =
                  'Invalid verification details passed. Check your inbox.';
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              let message = 'An error occurred while comparing unique strings.';
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        // user verification record does not exist
        let message =
          'Account record does not exist or has been verified already. Please signup or login.';
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        'An error occurred while checking for existing user verification record';
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
});

// Verified page route
router.get('/verified', (req, res) => {
  res.sendFile(path.join(__dirname, './../views/verified.html'));
});

// signin
router.post('/login', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  const user = new User({
    email: email,
    password: password,
  });

  if (email == '' || password == '') {
    res.json({
      status: 'FAILED',
      message: 'Empty credentials supplied',
    });
  } else {
    // Check if user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // user exists

          // check if user is verified

          if (!data[0].verified) {
            res.json({
              status: 'FAILED',
              message: "Email hasn't been verified yet. Check your inbox",
            });
          } else {
            const hashedPassword = data[0].password;
            bcrypt
              .compare(password, hashedPassword)
              .then((result) => {
                if (result) {
                  //password match
                  res.json({
                    status: 'SUCCESS',
                    message: 'Signin successfull',
                    data: data,
                  });
                  req.login(user, function (err) {
                    if (err) {
                      console.log(err);
                    } else {
                      passport.authenticate('local')(req, res, function () {
                        res.redirect('/secrets');
                      });
                    }
                  });
                } else {
                  res.json({
                    status: 'FAILED',
                    message: 'Invalid password entered!',
                    data: data,
                  });
                }
              })
              .catch((err) => {
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while comparing passwords',
                  data: data,
                });
              });
          }
        } else {
          res.json({
            status: 'FAILED',
            message: 'Invalid credentials entered.',
            data: data,
          });
        }
      })
      .catch((err) => {
        res.json({
          status: 'FAILED',
          message: 'An error occurred while checking for existing user',
          data: data,
        });
      });
  }
});

// signup
router.post('/register', (req, res) => {
  console.log(req.body);
  let { name, username, password, dob } = req.body;
  name = name.trim();
  email = username.trim();
  password = password.trim();
  dateOfBirth = dob.trim();

  if (name == '' || email == '' || password == '' || dateOfBirth == '') {
    res.json({
      status: 'FAILED',
      message: 'Empty input fields!',
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid name entered',
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid email entered',
    });
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: 'FAILED',
      message: 'Invalid date of birth entered',
    });
  } else if (password.length < 8) {
    res.json({
      status: 'FAILED',
      message: 'Password is too short',
    });
  } else {
    // Checking if user already exists
    User.find({ email }).then((result) => {
      if (result.length) {
        // A user already exists
        res.json({
          status: 'FAILED',
          message: 'User with the provided email already exists',
        });
      } else {
        // Try to create a new user

        // password handling
        const saltRounds = 10;
        bcrypt
          .hash(password, saltRounds)
          .then((hashedPassword) => {
            const newUser = new User({
              name,
              email,
              password: hashedPassword,
              dateOfBirth,
              verified: false,
            });

            newUser
              .save()
              .then((result) => {
                // handle account verification
                sendVerificationEmail(result, res);
              })
              .catch((err) => {
                res.json({
                  status: 'FAILED',
                  message: 'An error occurred while saving user account!',
                });
              });
          })
          .catch((err) => {
            res.json({
              status: 'FAILED',
              message: 'An error occurred while hashing password!',
            });
          });
      }
    });
  }
});

module.exports = router;
