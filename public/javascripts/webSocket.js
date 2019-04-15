var socket = new WebSocket("ws://localhost:8080");

socket.onopen = function() {
  sendMessage()
};

socket.onclose = function(event) {
  /*if (event.wasClean) {
    
  }*/
  // function to reconnect
  // with check authorization

  // insert ajasent html
};

socket.onmessage = function(event) {
  addMessage(event.data);
};

socket.onerror = function(error) {
  alert(error.message);
};

function addMessage(message) {

  let messagesWrap = document.querySelector('.messages-wrap');
  let messageShell = `<li>${message}</li>`;
  messagesWrap.insertAdjacentHTML('beforeend', messageShell);
}

function sendMessage() {

  let chatForm = document.querySelector('.chat-form');
  chatForm.addEventListener( 'submit', event => {

    let message = document.querySelector('[name="message"]').value;
    socket.send(message);
    event.preventDefault();
  })
}
