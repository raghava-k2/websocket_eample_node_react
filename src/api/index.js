const http = require('http');
const express = require('express')
const app = express()
const port = 4000
const server = http.createServer(app);
const { Server } = require("socket.io");
const cp = require('child_process');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
const io = new Server(server);
let socket = null;

app.post('/api/run/script', (req, res) => {
  console.log(req.body);
  let { script, room } = req.body;
  console.log('requested script : ', script);
  cp.exec(script, (error, stdout, stderr) => {
    if (stderr.trim().length) {
      console.log('error : ', stderr);
      io.to(room).emit('scriptOutput', stderr);
    } else {
      console.log('success : ', stdout);
      io.to(room).emit('scriptOutput', stdout);
    }
    res.jsonp(200);
  });
});

io.on('connection', (sock) => {
  console.log('connected to socket : ', sock.id);
  sock.on('join', (roomId) => {
    console.log('joined room :', roomId);
    sock.join(roomId);
  });
  socket = sock;
});

server.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
