var fs = require("fs");
var http = require("http");
var os = require("os");

String.prototype.format = function() {
	var index = 0;
	var string = (typeof(this) == "function" && !(index++))? arguments[0]:this;
	for (; index < arguments.length; index++) 
		string = string.replace(/\{\d+?\}/, arguments[index]);
	return string;
}

var getMyAddress = function() {
	var interfaces = os.networkInterfaces();
	var addresses = [];
	
	for (name in interfaces) {
		for (ip in interfaces[name]) {
			var address = interfaces[name][ip];
			if (address.family == "IPv4" && !address.internal) {
				addresses.push(address.address);
			}
		}
	}
	
	return addresses;
}

http.createServer(function(req, res) {
	fs.readFile('websocket_client.html', function(err, data) {
		res.writeHead(200, {'Content-Type' : 'text/html'});
		res.end((""+data).format(getMyAddress()));
	});
}).listen(8080, function() {
	console.log("Server running");
});