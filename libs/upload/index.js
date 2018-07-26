var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var request = require('request');
var FormStream = require('formstream');
var co = require('co');
var OSS = require('ali-oss');
var files;
var config = require("./config.json");
module.exports = upload;
function upload(url, pathname, cb) {
    if (isDirectory(pathname))
        return;
    var size = fs.lstatSync(pathname).size;
    var form = FormStream()
        .file('file', pathname);
    var rq = request.post(url || 'http://localhost:7001/api/upload', {
        method: 'POST',
        headers: form.headers(),
    }, function (err, res, rtn) {
        //...返回状态处理
        console.log(err, res, rtn);
        clearInterval(q);
        if (typeof cb === 'function') {
            cb(err, 100, res, rtn);
        }
    });
    var q = setInterval(function () {
        var dispatched = rq.req.connection._bytesDispatched;
        var percent = dispatched * 100 / size;
        console.log(rq.req.connection, size, "Uploaded: " + percent + "%");
        if (typeof cb === 'function') {
            cb(null, percent, null, null);
        }
    }, 250);
    form.pipe(rq);
}
function uploadOSS(pathnamea, filename, cb) {
    var pathname = '/Users/hexiao/Documents/ISO/cn_windows_10_multi_version_1709_updated_sept_2017_x64_dvd_100090774.iso';
    // if(isDirectory(pathname+filename) || uploaded.indexOf(filename) > -1) return ;
    var client = new OSS(config);
    co(function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.multipartUpload(filename, pathname, {
                        progress: function (p) {
                            return __generator(this, function (_a) {
                                console.log(p);
                                return [2 /*return*/];
                            });
                        },
                        meta: {
                            year: 2017,
                            people: 'test'
                        }
                    })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    }).catch(function (err) {
        cb(err);
        console.log(err);
    });
}
function readdir(path) {
    return fs.readdirSync(path);
}
function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}
