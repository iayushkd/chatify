const express = require('express');
const {chats} = require("./data/data.js");
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const {notFound,errorHandler} = require('./middleware/errorMiddleware')
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");

const cors = require('cors');


connectDB();
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

app.use(express.json());

app.get('/', (req,res) => {
  res.send("APIkgohjihjhkjg");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);


const server = app.listen(1239,() => {
  console.log(`server started`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
   socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

