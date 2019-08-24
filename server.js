const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/cu.wchusbserial14410', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

var dataGen;

port.on("open", () => {
    console.log('serial port open');
});parser.on('data', data =>{
    dataGen = data; 
});

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);



app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', dataGen);
    });
  });

function myFunc() {
    io.emit('dato luz', dataGen);
}  

setInterval(myFunc, 1500)

http.listen(3000, function(){
  console.log('listening on *:3000');
});
