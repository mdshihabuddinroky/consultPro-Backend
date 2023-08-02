const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./app/routes/userRoutes");
const profileRoutes = require("./app/routes/profileRoutes");
const workExperienceRoutes = require("./app/routes/workExperienceRoutes");
const categoryRoutes = require("./app/routes/categoryRoutes");
const chatRoutes = require('./app/routes/chatRoutes');
const authMiddleware = require('../middleware/authMiddleware');


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// Middleware
app.use(bodyParser.json());

// Mount routes
app.use('/users', userRoutes); // Mount userRoutes at '/users' endpoint
app.use('/profile', profileRoutes); // Mount profileRoutes at '/profile' endpoint
app.use('/profile', workExperienceRoutes); // Mount workExperienceRoutes at '/profile' endpoint
app.use('/categories', categoryRoutes); // Mount categoryRoutes at '/categories' endpoint
app.use('/chat', chatRoutes); // Mount chatRoutes at '/chat' endpoint

// Socket.io
const connectedUsers = new Map(); // Initialize the Map to store connected users
// Socket.io event handling
io.use((socket, next) => {
  // Access the JWT token from the socket handshake
  const token = socket.handshake.auth.token;
  if (!token) {
    // Return an error if token is not provided
    return next(new Error('Token not provided'));
  }

  // Use the authMiddleware to verify the token and get user_id
  authMiddleware.verifyToken(token)
    .then((user) => {
      socket.userId = user.user_id;
      next();
    })
    .catch((error) => {
      // Handle token verification errors
      next(new Error('Invalid token'));
    });
});

// Socket.io event handling
io.on('connection', (socket) => {
  
  console.log(`Socket connected: ${socket.id}`);

  // Access user data from the socket
  const { userId } = socket;
  
  // Store the socket information in a Map or object
  connectedUsers.set(userId, socket);


  // Handle typing event
  socket.on('typing', (data) => {
    console.log('User typing:', data);
    // Handle typing status here (e.g., update typing status in the database)
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Remove the socket information from the Map or object
    connectedUsers.delete(userId);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
