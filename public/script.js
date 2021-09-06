const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const room_heading=document.getElementById("room_heading");
const header=document.getElementById("header");
const end_call = document.getElementById('endMeeting');
const showChatDextop = document.querySelector('#showChatDextop');
const hideChatDextop = document.querySelector('#hideChatDextop');
// username fetched from mail Id of user 
var userName = username ? username : prompt('Enter your username');


myVideo.muted = true;

// move to main window from  chat in small display
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
  document.getElementById('room_heading').style.display = 'block';
});


//show chat window in small display
showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
  document.getElementById('room_heading').style.display = 'none';
});

//show chat window in dexktop display
showChatDextop.addEventListener('click', () => {
  document.querySelector('.main__left').style.display = 'flex';
  document.querySelector('.main__right').style.flex = '0.2';
  document.querySelector('.main__left').style.flex = '0.8';
  document.querySelector('.main__right').style.display = 'flex';
  hideChatDextop.style.display = 'flex';
  showChatDextop.style.display = 'none';
});

//hide chat window in dexktop display
hideChatDextop.addEventListener('click', () => {
  document.querySelector('.main__left').style.display = 'flex';
  document.querySelector('.main__right').style.flex = '0';
  document.querySelector('.main__left').style.flex = '1';
  document.querySelector('.main__right').style.display = 'none';
  hideChatDextop.style.display = 'none';
  showChatDextop.style.display = 'flex';
  
});


//initializing the peer connection on client side
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

//fetching audio and video stream
let myVideoStream;
navigator.mediaDevices
.getUserMedia({
  audio: true,
  video: true,
})
.then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });

  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  });
});


const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });  
};


//on peer connection join room method is emitted by socket
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, userName);
});


//video element is appended when new user joins
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

socket.on('joined', (username) => {
  alertfunction(username);
});

const alertfunction =(username)=>{
  room_heading.innerHTML= `${username} joined the meet `;
  header.classList.toggle('alert_msg');
  setTimeout(function(){room_heading.innerHTML= `ABHI-VAADAN Welcomes ${userName}`;header.classList.toggle('alert_msg');},2000);
  
};
// chat section starts

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");


const generateMessage = (username, text) => {
  return {
    username,
    text: text.trim(),
    createdAt: new Date().getTime(),
  };
};
socket.on("createMessage", (message, username) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
      <p class="message-header">
        <i class="far fa-user-circle"></i>
        <span class="author"> ${userName === username ? 'me' : username}</span>
        <span class="time">${moment(message.createdAt).format('hh:mm A')}</span>
      </p>
      <p class="message-text">${message.text}</p>
  </div>`;
});

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", generateMessage(username, text.value));
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", generateMessage(username, text.value));
    text.value = "";
  }
});
// chat section ended

//code to toggle audio and video

const toggleAudio = document.querySelector("#muteButton");
const toggleVideo = document.querySelector("#stopVideo");

toggleAudio.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    toggleAudio.classList.toggle("background__red");
    toggleAudio.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    toggleAudio.classList.toggle("background__red");
    toggleAudio.innerHTML = html;
  }
});

toggleVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    toggleVideo.classList.toggle("background__red");
    toggleVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    toggleVideo.classList.toggle("background__red");
    toggleVideo.innerHTML = html;
  }
});


//for ending the meet
end_call.addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    location.replace('/');
  }
});




