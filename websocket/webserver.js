var fs = require("fs");
var http = require("http");
var websocket = require("websocket");
var env = require("./module/environment");

env.init();

http.createServer(function(req, res) {
	fs.readFile('websocket_client.html', function(err, data) {
		var htmlString = data.toString();
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(htmlString.format(env.getIpAddress()));
	});
}).listen(env.getHttpPort(), function() {
	console.log("Server running (" + env.getIpAddress() + ":" + env.getHttpPort() +")");
});

var WebSocketServer = websocket.server;
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(env.getSockPort(), function() {
    console.log((new Date()) + ' Server is listening on (' + env.getIpAddress() + ":" + env.getSockPort() + ")");
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
