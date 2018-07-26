var speedTest = require('speedtest-net');
var Promise = require("bluebird");
exports.speedTest = function () { return new Promise(function (resolve, reject) {
    console.log('start speedtest');
    var test = speedTest({ maxTime: 5000 });
    test.on('data', function (data) {
        console.log('end speedtest');
        resolve(data);
    });
    test.on('error', function (err) {
        console.log('error speedtest');
        reject(err);
    });
}); };
