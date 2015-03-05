var util = require("./server_util");

function Environment() {
    // private
	var address = "128.0.0.1";
	var webserver_port = 8080;
	var websocket_port = 8000;

	// public
	this.init = function() {
		address = util.getAddress(); // get current device's ip address
		String.prototype.format = util.funcFormatToString; // function assign
	};

	this.getIpAddress = function() {
		return address;
	};

	this.getWebServerPort = function() {
		return webserver_port;
	};

	this.getWebSocketPort = function() {
		return websocket_port;
	};
}

var env = new Environment();

exports.init            = env.init;
exports.getIpAddress    = env.getIpAddress;
exports.getHttpPort     = env.getHttpPort;
exports.getSockPort     = env.getSockPort;
