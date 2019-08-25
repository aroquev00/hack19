const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/cu.wchusbserial14410', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data

var dataRaw;
var dataLuzActual;
var dataLuzTotal;
var dataAguaActual;
var dataAguaTotal;
var dataGastoTotalLuz = 0.0;
var dataGastoTotalAgua = 0.0;
var dataGastoTotal;

port.on("open", () => {
    console.log('serial port open');
  });
parser.on('data', data =>{ 
  dataRaw = data.toString();
  if ((dataRaw.split("#"))[0] == "Luz") {
  dataLuzActual = (dataRaw.split("#"))[1];
  dataLuzTotal = (dataRaw.split("#"))[2];
  dataGastoTotalLuz = (dataRaw.split("#"))[3];
  }
  else {
    dataAguaActual = (dataRaw.split("#"))[1];
    dataAguaTotal = (dataRaw.split("#"))[2];
    dataGastoTotalAgua = (dataRaw.split("#"))[3];
  }
  dataGastoTotal = parseFloat(dataGastoTotalAgua) + parseFloat(dataGastoTotalLuz);
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
      io.emit('chat message', dataLuzActual);
    });
  });

function myFunc() {
    io.emit('dato luz actual', dataLuzActual);
    io.emit('dato agua actual', dataAguaActual);
    io.emit('dato luz total', dataLuzTotal);
    io.emit('dato agua total', dataAguaTotal);
    io.emit("dato gasto total", dataGastoTotal);
}  

setInterval(myFunc, 1500)

http.listen(3000, function(){
  console.log('listening on *:3000');
});
