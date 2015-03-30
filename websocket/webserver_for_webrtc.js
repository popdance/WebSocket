/*jslint node:true*/
var fs = require("fs");
var http = require("http");
var websocket = require("websocket");
var env = require("./module/environment");

http.createServer(function (req, res) {
	'use strict';
	fs.readFile('webrtc_demo.html', function (err, data) {
		var htmlString = data.toString();
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(htmlString.format(env.getIpAddress() + ":" + env.getWebSocketPort()));
	});
}).listen(env.getWebServerPort(), function () {
    'use strict';
	console.log("Server running (" + env.getIpAddress() + ":" + env.getWebServerPort() + ")");
});

var WebSocketServer = websocket.server;
var server = http.createServer(function (request, response) {
    'use strict';
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(env.getWebSocketPort(), function () {
    'use strict';
    console.log((new Date()) + ' Server is listening on (' + env.getIpAddress() + ":" + env.getWebSocketPort() + ")");
});

var wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    'use strict';
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
    'use strict';
    var index, connection;
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    connection = request.accept('echo-protocol', request.origin);
    if (connection) {
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function (message) {
            var connections;
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);

                connection.sendUTF(message.utf8Data);
                connections = wsServer.connections;
                for (index = 0; index < connections.length; index += 1) {
                    if (connection !== connections[index]) {
                        connections[index].sendUTF(message.utf8Data);
                    }
                }
            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
                connections = wsServer.connections;
                for (index = 0; index < connections.length; index += 1) {
                    if (connection !== connections[index]) {
                        connections[index].sendBytes(message.binaryData);
                    }
                }
            }
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    }
});
