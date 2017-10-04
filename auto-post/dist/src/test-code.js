"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib = require("./auto-post-library");
var content = "\n<p>Hello</p><p>I am in the <a href='http://www.withcenter.com'>Withcenter, Inc.</a>office right now</p><p>\n    Withcenter, Inc. runs\n    <b><a href=\"https://www.philgo.com\">Philgo www.philgo.com</a></b>\n    </p>\n<p>\n    <div>Goodbye.</div>\n    <div>2017-10-04.</div>\n<p>\nJaeHo Song\n";
var re = lib.textify(content);
console.log("original =========> \n", content);
console.log("result: ======> \n", re);
//# sourceMappingURL=test-code.js.map