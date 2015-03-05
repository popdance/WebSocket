/*jslint node:true*/
var os = require("os");

var getIpAddress = function () {
    "use strict";
    var NetInterfaceName,
        Netinterface,
        addressInfoName,
        addressInfo,
        ipAddress = "128.0.0.1",
        NetInterfaces = os.networkInterfaces();

    for (NetInterfaceName in NetInterfaces) {
        if (NetInterfaces.hasOwnProperty(NetInterfaceName)) {
            Netinterface = NetInterfaces[NetInterfaceName];
            for (addressInfoName in Netinterface) {
                if (Netinterface.hasOwnProperty(addressInfoName)) {
                    addressInfo = Netinterface[addressInfoName];
                    if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                        ipAddress = addressInfo.address;
                        return ipAddress;
                    }
                }
            }
        }
    }

    return ipAddress;
};

var format = function () {
    "use strict";
    var index = 0,
        string;

    console.log(this);

    string = this;

    for (index = 0; index < arguments.length; index += 1) {
        string = string.replace(/\{\d+?\}/, arguments[index]);
    }

    return string;
};

function Environment() {
    "use strict";
	var address = "128.0.0.1", webserver_port = 8080, websocket_port = 8000;

	this.init = function () {
		address = getIpAddress();
		String.prototype.format = format; // function assign
	};

	this.getIpAddress = function () {
		return address;
	};

	this.getWebServerPort = function () {
		return webserver_port;
	};

	this.getWebSocketPort = function () {
		return websocket_port;
	};
}

var env = new Environment();
env.init();

exports.getIpAddress        = env.getIpAddress;
exports.getWebServerPort    = env.getWebServerPort;
exports.getWebSocketPort    = env.getWebSocketPort;
