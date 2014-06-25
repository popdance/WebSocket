var os = require("os");

var getAddress = function() {
  var address = "128.0.0.1";
  var interfaces = os.networkInterfaces();
  for (name in interfaces) {
    for (ip in interfaces[name]) {
      var address = interfaces[name][ip];
      if (address.family == "IPv4" && !address.internal) {
        address = address.address;
        return address;
      }
    }
  }
  return address;
};

// Implement String Object's replaceAll
var funcFormatToString = function() {
  var index = 0;
  var string = (typeof(this) == "function" && !(index++))? arguments[0]:this;
  for (; index < arguments.length; index++)
    string = string.replace(/\{\d+?\}/, arguments[index]);
  return string;
};

exports.getAddress = getAddress;
exports.funcFormatToString = funcFormatToString;
