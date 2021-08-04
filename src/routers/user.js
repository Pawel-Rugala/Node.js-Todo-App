const express = require('express')
const router = new express.Router()

// Data Models
const User = require('../models/user')

// CREATE
router.post('/users', async (req, res) => {
 const newUser = new User(req.body)
 try {
  await newUser.save()
  console.log(chalk.black.bgGreen('### SUCCESS ###'))
  console.log(chalk.black.bgGreen.inverse(newUser))
  res.status(201).send(newUser)
 } catch (err) {
  console.log(chalk.bgRed('### ERROR ###'))
  console.log(chalk.red(err))
  res.status(400).send(err)
 }
})
// READ
router.get('/users', async (req, res) => {
 try {
  const users = await User.find({})
  res.send(users)
 } catch (err) {
  res.status(500).send(err)
 }
})

router.get('/users/:id', async (req, res) => {
 try {
  const user = await User.findById(req.params.id)
  if (!user) {
   return res.send(404).send()
  }
  res.send(user)
 } catch (err) {
  res.status(500).send(err)
 }
})

// UPDATE
router.patch('/users/:id', async (req, res) => {
 try {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: true,
  })
  if (!user) return res.status(404).send()
  res.send(user)
 } catch (err) {
  res.status(400).send(err)
 }
})

// DELETE SINGLE
router.delete('/users/:id', async (req, res) => {
 try {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).send()
  res.send(user)
 } catch (err) {
  res.status(500).send(err)
 }
})

module.exports = router