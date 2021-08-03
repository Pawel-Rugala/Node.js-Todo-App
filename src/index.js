const chalk = require('chalk')
const express = require('express')
require('./db/mongoose')

// Data Models
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// CREATE USER & TASK
app.post('/users', (req, res) => {
 const newUser = new User(req.body)
 newUser
  .save()
  .then(() => {
   console.log(chalk.black.bgGreen('### SUCCESS ###'))
   console.log(chalk.black.bgGreen.inverse(newUser))
   res.send(newUser)
  })
  .catch((err) => {
   console.log(chalk.bgRed('### ERROR ###'))
   console.log(chalk.red(err))
   res.status(400).send(err)
  })
})

app.post('/tasks', (req, res) => {
 const newTask = new Task(req.body)
 newTask
  .save()
  .then(() => {
   console.log(chalk.black.bgGreen('### SUCCESS ###'))
   console.log(chalk.black.bgGreen.inverse(newTask))
   res.send(newTask)
  })
  .catch((err) => {
   console.log(chalk.bgRed('### ERROR ###'))
   console.log(chalk.red(err))
   res.status(400).send(err)
  })
})

// READ USER & TASK
app.get('/users', (req, res) => {
 User.find({})
  .then((data) => {
   res.send(data)
  })
  .catch((err) => {
   console.log(chalk.bgRed('### ERROR ###'))
   console.log(chalk.red(err))
   res.status(500).send(err)
  })
})

app.get('/users/:id', (req, res) => {
 User.findById(req.params.id)
  .then((data) => {
   if (!data) {
    return res.send(404).send()
   }
   res.send(data)
  })
  .catch((err) => res.status(500).send(err))
})

app.get('/tasks', (req, res) => {
 Task.find({})
  .then((data) => res.send(data))
  .catch((err) => res.status(500).send(err))
})

app.get('/tasks/:id', (req, res) => {
 Task.findById(req.params.id)
  .then((data) => {
   if (!data) {
    return res.send(404).send()
   }
   res.send(data)
  })
  .catch((err) => res.status(500).send(err))
})

app.get('/test', (req, res) => {
 Task.findByIdAndDelete('6108dce576338c6450c0b0f6')
  .then(() => {
   console.log('removed')
   return Task.find({ completed: false })
  })
  .then((data) => {
   res.send(data)
  })
  .catch((err) => res.status(500).send(err))
})

app.listen(port, () => console.log(`Server is running on ${port}`))
