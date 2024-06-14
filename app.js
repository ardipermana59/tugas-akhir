// Dependencies
const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const socket = require('./utils/SocketIo');
require('dotenv').config()

// Initialize express app
const app = express();
const indexRouter = require('./routes/index');
const server = http.createServer(app);
const io = socket.init(server);

// Set port
const port = process.env.PORT || 3000;

// Configure session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

// Parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// EJS Layouts
app.use(expressLayouts);
app.set("layout extractScripts", true)
app.set('layout', 'layouts/admin-main');
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', indexRouter);


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Additional socket event handlers can be added here
});

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
