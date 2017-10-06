"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var nightmare_1 = require("./../../nightmare/nightmare");
var argv = require('yargs').argv;
var protocol = require("./../protocol");
var lib = require("./../auto-post-library");
var firebase_1 = require("../firebase");
if (argv.pid === void 0) {
    console.log('no pid');
    process.exit(1);
}
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
var Facebook = (function (_super) {
    __extends(Facebook, _super);
    function Facebook(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.serverUrl = 'https://m.facebook.com';
        _this.post = null;
        _this.id = _this.argv.id;
        _this.password = _this.argv.password;
        _this.loginButton = 'input[name="login"]';
        _this.usernameField = 'input[name="email"]';
        _this.passwordField = 'input[name="pass"]';
        _this.postTextArea = 'textarea[name="xc_message"]';
        _this.postButton = 'input[name="view_post"]';
        _this.groupPostWarn = "a:contains('" + "1 post requiring approval" + "')";
        _this.firefox();
        return _this;
    }
    Facebook.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, firebase_1.getPost(argv.user, argv.key)];
                    case 1:
                        _a.post = _b.sent();
                        if (this.post === null)
                            protocol.end('fail', 'failed to get post from firebase');
                        else
                            protocol.send('got post from firebase');
                        return [4, this.login()];
                    case 2:
                        _b.sent();
                        return [4, this.publish()];
                    case 3:
                        _b.sent();
                        protocol.end('success', 'success');
                        return [2];
                }
            });
        });
    };
    Facebook.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $html, re;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get(this.serverUrl)];
                    case 1:
                        $html = _a.sent();
                        protocol.send('login', 'logging in...');
                        return [4, this.nextAction('Typing email and password.')];
                    case 2:
                        _a.sent();
                        return [4, this.insert(this.usernameField, this.id)];
                    case 3:
                        _a.sent();
                        return [4, this.insert(this.passwordField, this.password)];
                    case 4:
                        _a.sent();
                        return [4, this.nextAction('Press enter to login.')];
                    case 5:
                        _a.sent();
                        return [4, this.enter(this.passwordField)];
                    case 6:
                        _a.sent();
                        return [4, this.waitDisappear(this.passwordField)];
                    case 7:
                        re = _a.sent();
                        if (!re)
                            protocol.end('login', 'failed');
                        protocol.send('login', 'success');
                        return [4, this.wait('body')];
                    case 8:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Facebook.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var postThis, isPending, arr, isPosted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postThis = this.post.title + '\r\n' + lib.textify(this.post.content);
                        protocol.send('open forum: ' + this.argv.category, 'openning..');
                        return [4, this.get(this.serverUrl + '/groups/' + this.argv.category)];
                    case 1:
                        _a.sent();
                        protocol.send('checking post text area');
                        return [4, this.waitAppear(this.postTextArea)];
                    case 2:
                        _a.sent();
                        protocol.send('Typing the post: ', 'typing..');
                        return [4, this.insert(this.postTextArea, postThis)
                                .click(this.postButton)];
                    case 3:
                        _a.sent();
                        return [4, this.waitAppear(this.groupPostWarn, 5)];
                    case 4:
                        isPending = _a.sent();
                        if (!isPending) return [3, 5];
                        protocol.send('post', 'Post pending.');
                        return [3, 7];
                    case 5:
                        arr = postThis.split("\n");
                        return [4, this.findPost(arr[0].trim())];
                    case 6:
                        isPosted = _a.sent();
                        (isPosted) ? protocol.send('post', 'ok')
                            : protocol.end("post", 'Post has been submitted. Post is not pending. But post not found!');
                        _a.label = 7;
                    case 7: return [2];
                }
            });
        });
    };
    Facebook.prototype.findPost = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var selector, $html, re;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selector = "span:contains('" + query + "')";
                        console.log('selector: ', selector);
                        return [4, this.getHtml()];
                    case 1:
                        $html = _a.sent();
                        return [4, this.waitAppear(selector)];
                    case 2:
                        re = _a.sent();
                        return [4, re];
                    case 3: return [2, _a.sent()];
                }
            });
        });
    };
    return Facebook;
}(nightmare_1.MyNightmare));
var options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Facebook(options)).main();
//# sourceMappingURL=facebook.js.map