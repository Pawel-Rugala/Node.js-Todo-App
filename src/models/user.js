const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
 name: {
  type: String,
  required: true,
  trim: true,
 },
 age: {
  type: Number,
  default: 0,
  validate(value) {
   if (value < 0) throw new Error('age must be positive num')
  },
 },
 email: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
  validate(value) {
   if (!validator.isEmail(value)) throw new Error('invalid email address')
  },
 },
 password: {
  type: String,
  required: true,
  trim: true,
  minLength: [6, 'Password is too short'],
  validate(value) {
   if (value === 'password') throw new Error('password cannot be password')
  },
 },
})

module.exports = User
