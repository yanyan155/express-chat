let connectClose;
let errorFlag = false;

function createSocket() {
  var socket = new WebSocket("ws://localhost:8080");

  socket.onopen = function() {
    if(errorFlag) {
      location.reload();
    }
    connectClose = false;
    addMessage('Connection established.');
    sendMessage(this);
  };

  socket.onclose = function(event) {
    errorFlag = true;
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
    errorFlag = true;
    if(!connectClose) {
      addMessage('Something went wrong.')
    };
  };
}

function reconnect() {
  setTimeout(() => { createSocket(); }, 2000);
}

function addMessage(data) {
  let messagesWrap = document.querySelector('.messages-wrap');
  let liElem;

  try {
    let dataObj = JSON.parse(data);
    liElem = `<li><i>${dataObj.userName}</i> - ${dataObj.message}</li>`;
  } catch(err) {
    liElem = `<li>${data}</li>`;
  }

  messagesWrap.insertAdjacentHTML('beforeend', liElem);
}

function sendMessage(socket) {

  let chatForm = document.querySelector('.chat-form');
  chatForm.addEventListener( 'submit', event => {

    let message = document.querySelector('[name="message"]').value;
    socket.send(message);
    event.preventDefault();
    document.querySelector('[name="message"]').value = '';
    return false;
  })
}

createSocket();