const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/cu.wchusbserial14410', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

var dataRaw;
var dataLuz;
var dataAgua;

port.on("open", () => {
    console.log('serial port open');
  });
parser.on('data', data =>{ 
  dataRaw = data.toString();
  if ((dataRaw.split("#"))[0] == "Luz")
  dataLuz = (dataRaw.split("#"))[1];
  else {
    dataAgua = (dataRaw.split("#"))[1];
  }
});

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var htmlPath = path.join(__dirname, 'html');

app.use(express.static(htmlPath));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/html/index.html');
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', dataLuz);
    });
  });

function myFunc() {
    io.emit('dato luz', dataLuz);
    io.emit('dato agua', dataAgua);
}  

setInterval(myFunc, 1500)

http.listen(3000, function(){
  console.log('listening on *:3000');
});
