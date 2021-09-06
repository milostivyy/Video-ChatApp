const express = require('express');
const app = express();
const server = require('http').Server(app);
const { auth } = require('express-openid-connect');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);
app.use(express.static('public'));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTHO_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.use('/', require('./routes/index'));

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.to(roomId).emit('joined',userName);
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message, userName);
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App is up and running at PORT : ${port}`);
});
