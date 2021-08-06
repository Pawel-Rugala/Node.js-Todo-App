const express = require('express')
const router = new express.Router()
const chalk = require('chalk')

// Middleware
const auth = require('../middleware/auth')

// Data Models
const Task = require('../models/task')

// CREATE

router.post('/tasks', auth, async (req, res) => {
 const newTask = new Task({
  ...req.body,
  owner: req.user._id,
 })

 try {
  await newTask.save()
  console.log(chalk.black.bgGreen('### SUCCESS ###'))
  console.log(chalk.black.bgGreen.inverse(newTask))
  res.status(201).send(newTask)
 } catch (err) {
  console.log(chalk.bgRed('### ERROR ###'))
  console.log(chalk.red(err))
  res.status(400).send(err)
 }
})

// READ TASK

router.get('/tasks', auth, async (req, res) => {
 const match = {}
 const sort = {}
 req.query.completed ? (match.completed = req.query.completed === 'true') : ''
 if (req.query.sortBy) {
  const parts = req.query.sortBy.split(':')
  sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
 }
 try {
  await req.user
   .populate({
    path: 'tasks',
    match,
    options: {
     limit: parseInt(req.query.limit),
     skip: parseInt(req.query.skip),
     sort,
    },
   })
   .execPopulate()
  res.send(req.user.tasks)
 } catch (err) {
  res.status(500).send(err)
 }
})

router.get('/tasks/:id', auth, async (req, res) => {
 try {
  //const task = await Task.findById(req.params.id)
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
  if (!task) {
   return res.status(404).send()
  }
  res.send(task)
 } catch (err) {
  res.status(500).send(err)
 }
})

// UPDATE

router.patch('/tasks/:id', auth, async (req, res) => {
 const updates = Object.keys(req.body)
 try {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user_id })
  if (!task) return res.status(404).send()
  updates.forEach((update) => (task[update] = req.body[update]))
  await task.save()
  res.send(task)
 } catch (err) {
  res.status(400).send(err)
 }
})

// DELETE

router.delete('/tasks/:id', auth, async (req, res) => {
 try {
  const task = await Task.findOneAndDelete({
   _id: req.params.id,
   owner: req.user._id,
  })
  if (!task) return res.status(404).send()
  res.send(task)
 } catch (err) {
  res.status(500).send()
 }
})

module.exports = router
