const WebSocket = require('ws');
const config = require('../config');
const cookieParser = require('cookie-parser');
const sessionStore = require('../libs/sessionStore');
const User = require('../models/user');
const HttpError = require('../error');

const wss = new WebSocket.Server({ 
  port: config.get('socket:port'),
  host: config.get('socket:host'),
});
let wSocket;

wss.on('connection', async function connection(ws, request) {

  wSocket = ws;
  let cookieSid = parseCookie(request.headers.cookie);
  let sid = cookieParser.signedCookie(cookieSid[config.get('session:key')], config.get('session:secret'));

  let session;
  let user;
  try {
    session = await loadSession(sid);
    user = await loadUser(session.userId);
  } catch (err) {
    ws.terminate();
    return err;
  }
  
  request.socketSession = session;
  request.socketUser = user;
  

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  broadCastSocket(wss, ws, request, 'is connected to chat!', true);
  
  ws.on('message', function incoming(message) {
    broadCastSocket(wss, ws, request, message, false);
  });

  ws.on('close', function open() {
    broadCastSocket(wss, ws, request, 'is disconnected to chat!', true);
  });
});

wss.on('upgrade', async function upgrade(req, sid) {

  for (const client of wss.clients) {
    if (client === wSocket) {
      let session;
      let user;
      try {
        session = await loadSession(sid);
        user = await loadUser(session.userId);
      } catch (err) {
        wSocket.terminate();
        return err;
      }
    }
  }
  request.socketSession = session;
  request.socketUser = user;
});

wss.interval = function() {

  setTimeout(function ping() {

    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
   
      ws.isAlive = false;
      ws.ping(noop);
    });

    timerId = setTimeout(ping, 10000);
  }, 10000);
}

module.exports = wss;

function noop() {}
function heartbeat() {
  this.isAlive = true;
}

function loadSession(sid) {

  return new Promise(function(resolve, reject) {

    sessionStore.get(sid, (error, session) => {
      if (error || !session) {
        reject(new HttpError(401, 'No session'));
      }else if(session) {
        resolve(session);
      }
    })
  });
}

function loadUser(id) {

  return new Promise(function(resolve, reject) {

    User.findOne({'_id': id}, (error, user) => {
      if (error) {
        reject(new HttpError(403, 'Anonymous user'));
      }else {
        resolve(user);
      };
    })
  });
}

const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  },
{});

function broadCastSocket(wss, ws, request, message, isToOthers) {
  wss.clients.forEach(function each(client) {
    if(isToOthers) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        let data = {
          message: message,
          userName: request.socketUser.name
        }
        client.send(JSON.stringify(data));
      }
    } else {
      if (client.readyState === WebSocket.OPEN) {
        let data = {
          message: message,
          userName: request.socketUser.name
        }
        client.send(JSON.stringify(data));
      }
    }
  });
}