let connectClose;

function createSocket() {
  var socket = new WebSocket("ws://localhost:8080");

  socket.onopen = function() {
    connectClose = false;
    addMessage('Connection established.');
    sendMessage(this);
  };

  socket.onclose = function(event) {
    if(!connectClose) {
      addMessage('Connection close.');
    }
    socket.close();
    reconnect();
    connectClose = true;
  };

  socket.onmessage = function(event) {
    addMessage(event.data);
  };

  socket.onerror = function(error) {
    if(!connectClose) {
      addMessage('Something went wrong.')
    };
  };
}

function reconnect() {
  setTimeout(() => { createSocket(); }, 2000);
}

function addMessage(message) {

  let messagesWrap = document.querySelector('.messages-wrap');
  let messageShell = `<li>${message}</li>`;
  messagesWrap.insertAdjacentHTML('beforeend', messageShell);
}

function sendMessage(socket) {

  let chatForm = document.querySelector('.chat-form');
  chatForm.addEventListener( 'submit', event => {

    let message = document.querySelector('[name="message"]').value;
    socket.send(message);
    event.preventDefault();
    document.querySelector('[name="message"]').value = '';
  })
}

createSocket();