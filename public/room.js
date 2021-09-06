//modal on room page
var modal = document.querySelector('#modal');
var modalOverlay = document.querySelector('#modal-overlay');
var closeButton = document.querySelector('#close-button');
var openButton = document.querySelector('#meetingDetails');

closeButton.addEventListener('click', function () {
  modal.classList.toggle('closed');
});


// add participants icon on room page footer 
openButton.addEventListener('click', function () {
  modal.classList.toggle('closed');
  modalOverlay.classList.toggle('closed');
});

const meeting_url = (document.getElementById('meeting_url').innerHTML =
  document.location.href);

const iconCopy = document.getElementById('icon-copy');
iconCopy.addEventListener('click', () => {
  document.getElementById('meeting_url_input').value = meeting_url;
  var copyText = document.getElementById('meeting_url_input');
  console.log(copyText);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand('copy');
});

