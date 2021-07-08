require('dotenv').config();
const express = require('express')
import Template from '../template'
const mongoose = require('mongoose')



// Delete 2 lines around app before production
import devBundle from "./devBundle"
import app from './express'
devBundle.compile(app)

// Serves static files from dist folder
import path from 'path'
const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR,
  'dist')))

// Configure mongoose and db
let database_url = process.env.MONGODB_URI;
let db = mongoose.connection;
mongoose.connect(database_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

// Log connection results
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('connected to db')
})

// Sends template at root path 
app.get('/', function (req, res) {
  res.status(200).send(Template())
})

// app listen
let PORT = process.env.PORT || 4000
app.listen(PORT, function onStart(err) {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', PORT)
})
