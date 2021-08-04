const mongoose = require('mongoose')
const connectURL =
 'mongodb+srv://pabloapp:pabloapp@cluster0.6ikgs.mongodb.net/Cluster0?retryWrites=true&w=majority'

mongoose.connect(connectURL, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 dbName: 'task-app',
 useFindAndModify: false,
})
