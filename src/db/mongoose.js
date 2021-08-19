require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 dbName: 'task-app',
 useFindAndModify: false,
 useCreateIndex: true,
})
