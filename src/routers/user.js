const express = require('express')
const router = new express.Router()
const chalk = require('chalk')

// Data Models
const User = require('../models/user')

// Middleware
const auth = require('../middleware/auth')

// CREATE
router.post('/users', async (req, res) => {
 const newUser = new User(req.body)
 try {
  await newUser.save()
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
  res.send(req.user)
 } catch (err) {
  res.status(500).send(err)
 }
})

module.exports = router
