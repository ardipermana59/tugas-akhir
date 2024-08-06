// Dependencies
var expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const bodyParser = require('body-parser')
const { Socket } = require('./utils')
const express = require('express')
const path = require('path')
const http = require('http')
require('dotenv').config()

// Initialize express app
const app = express()
const indexRouter = require('./routes/index')
const server = http.createServer(app)
const io = Socket.init(server)

// Set port
const port = process.env.PORT || 3000

// Configure session middleware
app.use(session({
  secret: `86)08QmjPV#Cw*xTW&"'%GY<aim*=]`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}))

// Parse incoming requests
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// EJS Layouts
app.use(expressLayouts)
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)
app.set('layout', 'layouts/admin-main')
app.use((req, res, next) => {
  res.locals.title = 'Default Title'
  res.locals.app_name = process.env.APP_NAME
  res.locals.version = process.env.APP_VERSION
  res.locals.activePage = req.path
  next()
})

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Use routes
app.use('/', indexRouter)

// eslint-disable-next-line no-unused-vars
const cronJobs = require('./jobs/cron_jobs')

// Socket.IO connection handling
io.on('connection', (Socket) => {
  Socket.on('disconnect', () => {
    console.log('User disconnected')
  })

})

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
