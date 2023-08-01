const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./app/routes/userRoutes");
const profileRoutes = require("./app/routes/profileRoutes");
const workExperienceRoutes = require("./app/routes/workExperienceRoutes");
const categoryRoutes = require("./app/routes/categoryRoutes");
const chatRoutes = require('./app/routes/chatRoutes');



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

// Add socket.io middleware to access user data in socket events
io.use((socket, next) => {
  // Access user data from the socket
  const { user } = socket.handshake.query;
  socket.user = user;
  next();
});

// Socket.io event handling
io.on('connection', (socket) => {
  
  console.log(`Socket connected: ${socket.id}`);

  // Handle incoming messages
  socket.on('chatMessage', (data) => {
    // Broadcast the message to all connected clients
    io.emit('newMessage', { user: data.user, message: data.message });
  });

  // Handle typing event
  socket.on('typing', (data) => {
    console.log('User typing:', data);
    // Handle typing status here (e.g., update typing status in the database)
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
