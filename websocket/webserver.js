var fs = require("fs");
var http = require("http");

http.createServer(function(req, res) {
	fs.readFile('websocket_client.html', function(err, data) {
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end(data);
	});
}).listen(8080, function() {
	console.log("Server running");
});