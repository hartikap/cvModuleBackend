//!! Is the way to comment out Arduino-communication

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path");
var io = require('socket.io')(server);

var PythonShell = require('python-shell');
var pyshell = new PythonShell('python_modules/PWMdriver.py');


var voltage = "";
var previousVoltage = 0;
var cleanData = "";
var readData = "";


app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io')));

io.sockets.on('connection', function (socket) {

    console.log("User connected");
    socket.on('voltageOut',function(data) {
	
	pyshell.send(data)
	//console.log(data)

	
    });
    
});



/*
if (portName != "0") {
    
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
}*/



server.listen(8088, function() {
    console.log('listening on *:8088');
});



/*/ This function runs until arduino is found on '/dev/ttyACM0..2'.
function activePort () {

    var n = 0;
    var workingPort = "0";
    var callbackFired = 1;
    while ( n<3 || (workingPort == "0") ) {

	//if (callbackFired) 

	//callbackFired = 0;
	var portTest = "/dev/ttyACM" + n;
	//console.log(portTest);
	

	
	    var serialPortTest = new SerialPort(portTest, {
		baudrate: 9600,
		databits: 8,
		stopBits: 1,
		flowControl: false,
	    }, false);
	    

	    serialPortTest.open(function (error) {

		//callbackFired = 1;
		if (error) {
		    console.log(portTest + " did not open correctly");
		    serialPortTest.close();
		
		} else {
		    console.log(portTest + " opened like a boss");
		    workingPort = portTest;
		    //serialPortTest.close();
		}
	    });

	n++;
	//}
    }
    if (workingPort != "0"){
	console.log("Arduino found in " + workingPort);
    }
    console.log ("Trying to return: "+ workingPort);
    return workingPort;
}*/


			    

	    
    
