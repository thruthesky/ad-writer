"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function set(pid) {
    exports.protocolName = pid;
}
exports.set = set;
function send(code, msg) {
    if (msg === void 0) { msg = ''; }
    console.log(exports.protocolName + "=" + code + ": " + msg);
}
exports.send = send;
function end(code) {
    console.log(exports.protocolName + "=" + code);
    process.exit(0);
}
exports.end = end;
//# sourceMappingURL=protocol.js.map