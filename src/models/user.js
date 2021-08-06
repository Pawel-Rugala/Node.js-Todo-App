const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const userSchema = new mongoose.Schema(
 {
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
   unique: true,
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
  tokens: [
   {
    token: {
     type: String,
     required: true,
    },
   },
  ],
 },
 {
  timestamps: true,
 }
)

userSchema.virtual('tasks', {
 ref: 'Task',
 localField: '_id',
 foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
 const userObject = this.toObject()

 delete userObject.password
 delete userObject.tokens

 return userObject
}

userSchema.methods.generateAuthToken = async function () {
 const token = jwt.sign({ _id: this._id.toString() }, 'asdkjlpqwpo12zc-!')
 console.log(token)
 this.tokens = this.tokens.concat({ token })
 await this.save()
 return token
}

userSchema.statics.findByCredentials = async (email, password) => {
 const user = await User.findOne({ email })
 if (!user) throw new Error('User not found')
 const isMatch = await bcrypt.compare(password, user.password)
 if (!isMatch) throw new Error('Unable to login')
 return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
 if (this.isModified('password')) {
  this.password = await bcrypt.hash(this.password, 8)
 }

 next()
})

// Delete user tasks
userSchema.pre('remove', async function (next) {
 const user = this
 await Task.deleteMany({ owner: user._id })

 next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
