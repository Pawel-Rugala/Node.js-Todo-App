const chalk = require('chalk')
const express = require('express')
require('./db/mongoose')

// Data Models
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

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

app.listen(port, () => console.log(`Server is running on ${port}`))
