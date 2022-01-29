require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const authRoute = require('./routes/auth')
const toDosRoute = require('./routes/todos')
const app = express()

app.use(express.json())
app.use('/api/auth', authRoute);
app.use('/api/todos', toDosRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database')

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((e) => {
    console.log(e)
  })
