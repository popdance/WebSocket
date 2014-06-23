var fs = require("fs");
var http = require("http");
var os = require("os");

var ServerEnvironment = {
	address : "128.0.0.1",
	httpport : 8080,
	websocketport : 8000,
	init : function() {
	   	address = this.getIpAddress();

		console.log("address : " + address);

		// Implement String Object's replaceAll
		String.prototype.format = function() {
			var index = 0;
			var string = (typeof(this) == "function" && !(index++))? arguments[0]:this;
			for (; index < arguments.length; index++)
				string = string.replace(/\{\d+?\}/, arguments[index]);
			return string;
		}
	},
	getIpAddress : function() {
		// Get My IP Address
		var interfaces = os.networkInterfaces();
		for (name in interfaces) {
			for (ip in interfaces[name]) {
				var address = interfaces[name][ip];
				if (address.family == "IPv4" && !address.internal) {
					return this.address = address.address;
				}
			}
		}
	}
}

ServerEnvironment.init();

http.createServer(function(req, res) {
	fs.readFile('websocket_client.html', function(err, data) {
		var htmlString = data.toString();
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(htmlString.format(ServerEnvironment.address));
	});
}).listen(ServerEnvironment.httpport, function() {
	console.log("Server running (" + ServerEnvironment.address + ":" + ServerEnvironment.httpport + ")");
});

var WebSocketServer = require('websocket').server;
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(ServerEnvironment.websocketport, function() {
    console.log((new Date()) + ' Server is listening on (' + ServerEnvironment.address + ":" + ServerEnvironment.websocketport + ")");
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

		connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
			var connections = wsServer.connections;
			for (var index = 0; index < connections.length; index++) {
				if (connection != connections[index]) {
					connections[index].sendUTF(message.utf8Data);
				}
			}
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
