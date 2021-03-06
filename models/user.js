const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthdayDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  browser_location: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);