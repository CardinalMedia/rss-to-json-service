require('dotenv').config()

const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const expressJwt = require('express-jwt')
let JWT_SECRET = process.env.JWT_SECRET || 'use-this-or-gen-new-secret'

// fetch controllers
const Models = require('./db.js')
const Controllers = {}
const Services = {}

let controllerPath = path.join(__dirname, 'api/controllers')
let servicesPath = path.join(__dirname, 'api/services')

fs.readdirSync(controllerPath).forEach((file) => {
  var fileName = file.split('.')
  Controllers[fileName[0]] = require('./api/controllers/' + file)
})

fs.readdirSync(servicesPath).forEach((file) => {
  var fileName = file.split('.')
  Services[fileName[0]] = require('./api/services/' + file)
})

var apiPrefix = '/api/v1'
const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.models = Models
app.services = Services

// Parse Routes

app.get(apiPrefix + '/parse', Controllers.parser.find)

// Status Routes

app.get(apiPrefix + '/routes', (req, res) => {
  return res.status(200).json({
    endpoints: app._router.stack.filter(r => r.route).map(r => r.route.path)
  })
})
app.get(apiPrefix + '/status', Controllers.status.find)

// User Routes
// app.post(apiPrefix + '/users', Controllers.user.create)
// app.get(apiPrefix + '/users', expressJwt({secret: JWT_SECRET, credentialsRequired: false}), Controllers.user.find)
// app.get(apiPrefix + '/users/:id', expressJwt({secret: JWT_SECRET}), Controllers.user.findById)
// app.put(apiPrefix + '/users', expressJwt({secret: JWT_SECRET}), Controllers.user.update)
// app.delete(apiPrefix + '/users', expressJwt({secret: JWT_SECRET}), Controllers.user.destroy)

// Auth Routes
// app.post(apiPrefix + '/auth', Controllers.auth.login)
// app.post(apiPrefix + '/auth/password/reset/start', Controllers.auth.startPasswordReset)
// app.get('/password/reset/:token', Controllers.auth.renderForm)
// app.post(apiPrefix + '/auth/password/reset/', Controllers.auth.savePasswordReset)

app.get('/', (req, res) => {
  res.status(200).json({
    apiStatus: 'ok'
  })
})

app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found'
  })
})

var port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('serving: http://localhost:' + port)
})
