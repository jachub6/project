// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var souradniceX=[];
var souradniceY=[];
var souradniceEXX=[];
var souradniceEXY=[];
var souradnice = {x:0, y:0, exx:0, exy:0};
app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));
app.use('/img', express.static(__dirname + '/img'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(8080, function() {
  console.log('Starting server on port 5000');
});

// Add the WebSocket handlers
io.on('connection', function(socket) {
  souradnice.x = souradniceX;
  souradnice.y = souradniceY;
  souradnice.exx = souradniceEXX;
  souradnice.exy = souradniceEXY;  
  socket.emit("souradnice", souradnice);
  
  socket.on('vykreslit', function(data) {
    souradniceX.push(data.x);
    souradniceY.push(data.y);
    souradniceEXX.push(data.exx);
    souradniceEXY.push(data.exy);
    socket.broadcast.emit("mouse", data);
  });
  
  socket.on("vymazat", function(){
    socket.broadcast.emit("vymazat");
    souradniceX=[];
    souradniceY=[];
    souradniceEXX=[];
    souradniceEXY=[];
    souradnice = {x:0, y:0, exx:0, exy:0};
    
  });
});
