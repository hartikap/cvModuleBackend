var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var io = require('socket.io')(server);
var SerialPort = require("serialport").SerialPort;
var portnumber = process.argv[2];
var portName = '/dev/ttyACM' + portnumber;
if (!portnumber) {
    console.log("Please pass arduino port number as an argument (0...X). If arduino is");
    console.log("in port /dev/ttyACM0, start this file with the command 'node index.js 0'");
    process.exit();
}

var sp = new SerialPort(portName, {
    baudrate: 9600,
    databits: 8,
    stopBits: 1,
    flowControl: false,
});
var voltage = "";
var previousVoltage = 0;
var cleanData = "";
var readData = "";


app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io')));

io.sockets.on('connection', function (socket) {

    console.log("User connected");
    socket.on('voltageOut',function(data) {
	var data_string = data.toString();
	var char1 = data_string.charAt(0);
	var char2 = data_string.charAt(1);
	var char3 = data_string.charAt(2);
	if (sp.isOpen()) {
	    sp.write(char1);
	    sp.write(char2);
	    sp.write(char3);
	    sp.write('A');
	}
    });
});


sp.open(function (error) {
    
    if (error) {

	console.log("failed to open: " + error);
	sp.close();
	
    } else {

	console.log('arduino connected');

	sp.on('data', function(data) {

	    readData += data.toString(); // append data to buffer

	    if (readData.indexOf('B') >=  0){
	
		cleanData = readData.substring(0, readData.indexOf('B'));
		io.sockets.emit('voltageIn', cleanData);

		if ( readData.length > (readData.indexOf('B')+1) ) {
		    readData = readData.substring(readData.indexOf('B')+1, readData.length+1);
		} else {
		    readData = "";
		}		    
	    }    
	});	
    }    
});


   
server.listen(8088, function() {
    console.log('listening on port 8088');
});
