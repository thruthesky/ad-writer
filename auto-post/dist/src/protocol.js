"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function set(name, category) {
    exports.protocolName = name + '/' + category;
}
exports.set = set;
function send(code, msg) {
    if (msg === void 0) { msg = ''; }
    console.log(exports.protocolName + "=" + code + ": " + msg);
}
exports.send = send;
function end(code, msg) {
    if (msg === void 0) { msg = ''; }
    console.log(exports.protocolName + "=" + code + ": " + msg);
    process.exit(0);
}
exports.end = end;
//# sourceMappingURL=protocol.js.map