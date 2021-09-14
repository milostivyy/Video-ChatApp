const express = require('express');
const app = express();
const server = require('http').Server(app);//// you explicitly create the http server.
const { auth } = require('express-openid-connect');
const { v4: uuidv4 } = require('uuid');//integrate uuidv4 into your project by using the require function.
require('dotenv').config();//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. 

app.use(express.urlencoded({ extended: true }));//method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.set('view engine', 'ejs');//it looks into the 'views' folder for the templates to render. 
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
//Express JS middleware implementing sign on for Express web apps using OpenID Connect.
//With this basic configuration, application will require authentication for all routes and store the user identity in an encrypted and signed cookie.
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
