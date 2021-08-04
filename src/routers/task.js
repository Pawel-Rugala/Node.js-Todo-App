const express = require('express')
const router = new express.Router()

// Data Models
const Task = require('../models/task')

// CREATE USER & TASK

router.post('/tasks', async (req, res) => {
 const newTask = new Task(req.body)
 try {
  await newTask.save()
  console.log(chalk.black.bgGreen('### SUCCESS ###'))
  console.log(chalk.black.bgGreen.inverse(newTask))
  res.send(newTask)
 } catch (err) {
  console.log(chalk.bgRed('### ERROR ###'))
  console.log(chalk.red(err))
  res.status(400).send(err)
 }
})

// READ USER & TASK

router.get('/tasks', async (req, res) => {
 try {
  const tasks = await Task.find({})
  res.send(tasks)
 } catch (err) {
  res.status(500).send(err)
 }
})

router.get('/tasks/:id', async (req, res) => {
 try {
  const task = await Task.findById(req.params.id)
  if (!task) {
   return res.status(404).send()
  }
  res.send(task)
 } catch (err) {
  res.status(500).send(err)
 }
})

// UPDATE

router.patch('/tasks/:id', async (req, res) => {
 try {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
   new: true,
   runValidators: true,
  })
  if (!task) return res.status(404).send()
  res.send(task)
 } catch (err) {
  res.status(400).send(err)
 }
})

// DELETE

router.delete('/tasks/:id', async (req, res) => {
 try {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) return res.status(404).send()
  res.send(task)
 } catch (err) {
  res.status(500).send()
 }
})

module.exports = router
