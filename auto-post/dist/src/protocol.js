"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require('cheerio');
function set(pid) {
    pid = pid.replace(/^"|"$/g, '');
    exports.protocolName = pid;
}
exports.set = set;
function send(code, msg) {
    if (msg === void 0) { msg = ''; }
    console.log(exports.protocolName + "=" + code + ": " + msg);
}
exports.send = send;
function end(code, msg) {
    if (msg === void 0) { msg = ''; }
    send(code, msg);
    process.exit(0);
}
exports.end = end;
function success() {
    end('success');
}
exports.success = success;
function fail(msg) {
    if (msg === void 0) { msg = ''; }
    end('fail', msg);
}
exports.fail = fail;
//# sourceMappingURL=protocol.js.map