document.addEventListener("DOMContentLoaded", function(){

  let form = document.querySelector('.autorization');

  form.addEventListener('submit', (event)=> {

    let name = document.querySelector('[name="name"]').value;
    let password = document.querySelector('[name="password"]').value;
    let data = {
      name,
      password
    };
    let jsonData = JSON.stringify(data);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("charset", "UTF-8");
    xhr.send(jsonData);
    xhr.onload = function() {
      if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText);
      } else {
        window.location.href = "/chat";
      }
    };
    event.preventDefault();
  })
});
