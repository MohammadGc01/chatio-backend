const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// روت‌ها
const userRouter = require('./routes/user');
const imageRouter = require('./routes/image');
const chatRouter = require('./routes/chat');
app.use('/user', userRouter);
app.use('/image', imageRouter);
app.use('/chat', chatRouter);

// ✨ WebSocket logic جدا در فایل مخصوص
require('socket.io')(io);

app.use((req, res) => {
  res.status(404).send('404');
});
app.set('io', io);

server.listen(3500, () => {
  console.log('🚀 Server is running on port 3500');
});
