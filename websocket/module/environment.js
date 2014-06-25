var util = require("./server_util");

function Environment() {
	// private
	var address = "128.0.0.1";
	var http_port = 8080;
	var sock_port = 8000;

	// public
	this.init = function() {
		address = util.getAddress(); // get current device's ip address
		String.prototype.format = util.funcFormatToString; // function assign
	};

	this.getIpAddress = function() {
		return address;
	};

	this.getHttpPort = function() {
		return http_port;
	};

	this.getSockPort = function() {
		return sock_port;
	};
}

var env = new Environment();

exports.init = env.init;
exports.getIpAddress = env.getIpAddress;
exports.getHttpPort = env.getHttpPort;
exports.getSockPort = env.getSockPort;
