// index.js

const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./app/routes/userRoutes");
const profileRoutes = require("./app/routes/profileRoutes");
const workExperienceRoutes = require("./app/routes/workExperienceRoutes");
const categoryRoutes = require("./app/routes/categoryRoutes");
const chatRoutes = require('./app/routes/chatRoutes');
const authMiddleware = require('./app/middleware/authMiddleware');
const { verifyToken } = require('./app/middleware/authMiddleware');
const http = require('http');
const WebSockets = require('./app/utils/websockets'); // Import the WebSocket-related functions
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);

//const io = socketio(server);
// Middleware
app.use(bodyParser.json());
global.io = socketio(server);
const websockets = new WebSockets(); // Initialize WebSockets with your socket.io instance
app.set('websockets', websockets); // Set it as an app-level variable
// Mount routes
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/profile', workExperienceRoutes);
app.use('/categories', categoryRoutes);
app.use('/chat', chatRoutes);
global.users = [];

io.use((socket, next) => {
  // Access the JWT token from the socket handshake
  const token = socket.handshake.auth.token;
  if (!token) {
    // Return an error if the token is not provided
    return next(new Error('Token not provided'));
  }
  // Use the authMiddleware to verify the token and get user_id
  try {
    const user = verifyToken(token);
    socket.userId = user.user_id;

    // Store the user's socket with their ID in the global.users array
    global.users.push({
      socketId: socket.id,
      userId: user.user_id,
    });

    console.log(`User ${user.user_id} connected.`);

    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  const userId = socket.userId; // Get the user's ID from authentication

  // Join the room with the user's own ID
  socket.join(userId);
  io.on('newMessage', (data) => {
    // Handle the new message here, e.g., save it to a database
    console.log('New message:', data);
    
  });

  socket.on("disconnect", () => {
    // Remove the user's socket from the map when they disconnect
    global.users = global.users.filter((user) => user.socketId !== socket.id);

    console.log(`User disconnected.`);
  });
});










const PORT = 3000;
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// Now you can use emitToUser anywhere in your controllers
