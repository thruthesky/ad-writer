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
var path = require("path");
var protocol = require("./../protocol");
var lib = require("./../auto-post-library");
var firebase_1 = require("../firebase");
var fs = require("fs");
var argv = require('yargs').string('category').argv;
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
        _this.id = argv.id;
        _this.password = argv.password;
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
                        protocol.success();
                        return [2];
                }
            });
        });
    };
    Facebook.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $html, re, isLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get(this.serverUrl)];
                    case 1:
                        $html = _a.sent();
                        protocol.send('login', 'logging in...');
                        return [4, this.insert('input[name="email"]', this.id)];
                    case 2:
                        _a.sent();
                        return [4, this.insert('input[name="pass"]', this.password)];
                    case 3:
                        _a.sent();
                        return [4, this.enter('input[name="pass"]')];
                    case 4:
                        _a.sent();
                        return [4, this.waitDisappear('input[name="pass"]', 5)];
                    case 5:
                        re = _a.sent();
                        if (!re)
                            this.captureError('Still in login page after timeout!.');
                        return [4, this.get(this.serverUrl)];
                    case 6:
                        _a.sent();
                        return [4, this.waitAppear("a:contains('Logout')", 5)];
                    case 7:
                        isLogin = _a.sent();
                        if (!!isLogin) return [3, 9];
                        return [4, this.captureError('Failed login.')];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        protocol.send('login', 'success');
                        return [2];
                }
            });
        });
    };
    Facebook.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, postThis, isGroupOpen, canPost, isPending, isPosted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = this.post.title + '\n' + lib.textify(this.post.content);
                        postThis = content.trim();
                        protocol.send('Opening Group: ', argv.category);
                        return [4, this.get(this.serverUrl + '/groups/' + this.argv.category)];
                    case 1:
                        _a.sent();
                        return [4, this.waitAppear('a[name=groupMenuBottom]', 5)];
                    case 2:
                        isGroupOpen = _a.sent();
                        if (!!isGroupOpen) return [3, 4];
                        return [4, this.captureError('captureError on opening group page.')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        protocol.send('Opening :' + argv.category, 'success!');
                        protocol.send('checking post text area');
                        return [4, this.waitAppear('textarea[name="xc_message"]')];
                    case 5:
                        canPost = _a.sent();
                        if (!!canPost) return [3, 7];
                        return [4, this.captureError('Cant find textarea to post.')];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        protocol.send('checking post text area', 'text area found!');
                        protocol.send('Typing the post: ', 'typing..');
                        return [4, this.insert('textarea[name="xc_message"]', postThis)];
                    case 8:
                        _a.sent();
                        return [4, this.click('input[name="view_post"]')];
                    case 9:
                        _a.sent();
                        protocol.send('Verify post if posted');
                        return [4, this.waitAppear("a:contains('1 post requiring approval')", 5)];
                    case 10:
                        isPending = _a.sent();
                        if (isPending)
                            protocol.end('post', 'Post pending.');
                        return [4, this.findPost(postThis)];
                    case 11:
                        isPosted = _a.sent();
                        if (!!isPosted) return [3, 13];
                        return [4, this.captureError('Post not found.')];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        protocol.send('Posting', 'success');
                        return [2];
                }
            });
        });
    };
    Facebook.prototype.findPost = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var arr, selector, re;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = query.trim().split('\n');
                        selector = "span:contains('" + arr[0].trim() + "')";
                        return [4, this.waitAppear(selector)];
                    case 1:
                        re = _a.sent();
                        return [2, re];
                }
            });
        });
    };
    Facebook.prototype.captureError = function (message, filePath, fileName) {
        if (filePath === void 0) { filePath = path.join(__dirname, '..', 'screenshot'); }
        if (fileName === void 0) { fileName = lib.timeStamp() + '-facebook.png'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(filePath))
                            fs.mkdirSync(filePath);
                        return [4, this.screenshot(path.join(filePath, fileName))];
                    case 1:
                        _a.sent();
                        protocol.end('fail', message + " Check screenshot at (" + filePath + "/" + fileName + ")");
                        return [2];
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