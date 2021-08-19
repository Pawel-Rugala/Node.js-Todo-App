const express = require('express')
const router = new express.Router()
const chalk = require('chalk')
const multer = require('multer')
const shartp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

// Data Models
const User = require('../models/user')

// Middleware
const auth = require('../middleware/auth')
const sharp = require('sharp')

// CREATE
router.post('/users', async (req, res) => {
 const newUser = new User(req.body)
 try {
  await newUser.save()
  sendWelcomeEmail(newUser.email, newUser.name)
  console.log(chalk.black.bgGreen('### SUCCESS ###'))
  console.log(chalk.black.bgGreen.inverse(newUser))
  const token = await newUser.generateAuthToken()
  res.status(201).send({ newUser, token })
 } catch (err) {
  console.log(chalk.bgRed('### ERROR ###'))
  console.log(chalk.red(err))
  res.status(400).send(err)
 }
})
// READ
router.get('/users/me', auth, async (req, res) => {
 res.send(req.user)
})

// UPDATE
router.patch('/users/me', auth, async (req, res) => {
 const updates = Object.keys(req.body)
 try {
  const user = req.user
  updates.forEach((update) => (user[update] = req.body[update]))
  await user.save()
  res.send(user)
 } catch (err) {
  res.status(400).send(err)
 }
})

// Auth
router.post('/users/login', async (req, res) => {
 try {
  const user = await User.findByCredentials(req.body.email, req.body.password)
  const token = await user.generateAuthToken()
  res.send({ user, token })
 } catch (err) {
  res.status(400).send()
 }
})

router.post('/users/logout', auth, async (req, res) => {
 try {
  req.user.tokens = req.user.tokens.filter((token) => {
   return token.token !== req.token
  })
  await req.user.save()
  res.send()
 } catch (err) {
  res.status(500).send()
 }
})

router.post('/users/logoutAll', auth, async (req, res) => {
 try {
  req.user.tokens = []
  await req.user.save()
  res.send()
 } catch (err) {
  res.status(500).send()
 }
})

// DELETE SINGLE
router.delete('/users/me', auth, async (req, res) => {
 try {
  await req.user.remove()
  sendCancelEmail(req.user.email, req.user.name)
  res.send(req.user)
 } catch (err) {
  res.status(500).send(err)
 }
})

const upload = multer({
 limits: {
  fileSize: 1000000,
 },
 fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
   return cb(new Error('Please upload MS Word document'))
  }
  return cb(undefined, true)
 },
})

// Upload avatar
router.post(
 '/users/me/avatar',
 auth,
 upload.single('avatar'),
 async (req, res) => {
  const buffer = await sharp(req.file.buffer)
   .resize({ width: 250, height: 250 })
   .png()
   .toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
 },
 (error, req, res, next) => {
  res.status(400).send({ error: error.message })
 }
)

// Delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
 req.user.avatar = undefined
 await req.user.save()
 res.send()
})

// Get avatar
router.get('/users/:id/avatar', async (req, res) => {
 try {
  const user = await User.findById(req.params.id)
  if (!user || !user.avatar) {
   throw new Error()
  }
  res.set('Content-Type', 'image/png')
  res.send(user.avatar)
 } catch (err) {
  res.status(400).send()
 }
})

module.exports = router
