"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib = require("./auto-post-library");
var content = '<p>Hello</p><p>I am in the <a href=\'http://www.withcenter.com\'>Withcenter, Inc.</a>office right now</p><p>Withcenter, Inc. runs<b><a href="https://www.philgo.com">Philgo www.philgo.com</a></b></p><p><div>Goodbye.</div><div>2017-10-04.</div><p>JaeHo Song';
var re = lib.textify(content);
console.log("original =========> \n", content);
console.log("result: ======> \n", re);
//# sourceMappingURL=test-code.js.map