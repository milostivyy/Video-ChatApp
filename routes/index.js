//defining all routes in this file 

// setting up express server
const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

//library to generate random room Id's
const { v4: uuidv4 } = require('uuid');


router.get('/', function (req, res) {
  res.render('home');
});

//route to start a new meet
router.get('/newMeeting', requiresAuth(), function (req, res) {
  res.redirect(uuidv4());
});

router.post('/', requiresAuth(), (req, res) => {
  return uuidv4();
});


router.post('/joinMeeting', requiresAuth(), function (req, res) {
  const roomID = req.body.roomId;
  res.redirect(roomID);
});

router.get('/:room', requiresAuth(), (req, res) => {
  const roomId = req.params.room;
  const username = req.oidc.user.nickname;
  res.render('room', { roomId, username });
});

module.exports = router;
