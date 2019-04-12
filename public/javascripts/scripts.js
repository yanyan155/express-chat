let logOut = document.querySelector('.log-out');
if(logOut) {
  logOut.addEventListener( 'click', event => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/logout', true);
    xhr.send();
    xhr.onload = function() {
      window.location.href = "/";
    };
    event.preventDefault();
  })
}