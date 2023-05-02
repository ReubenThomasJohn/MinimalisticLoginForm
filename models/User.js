const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  password: String,
  dateOfBirth: {
    type: Date,
    unique: false,
  },
  verified: Boolean,
});

// const User = new mongoose.model('User', userSchema);

module.exports = { userSchema };
