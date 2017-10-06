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
var argv = require('yargs').string('category').argv;
var $ = require('cheerio');
var protocol = require("./../protocol");
var lib = require("../auto-post-library");
var path = require("path");
var firebase_1 = require("../firebase");
if (argv.pid === void 0) {
    console.log('no pid');
    process.exit(1);
}
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
var Blogger = (function (_super) {
    __extends(Blogger, _super);
    function Blogger(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.bloggerUrl = 'https://www.blogger.com';
        _this.post = null;
        _this.id = argv.id;
        _this.password = argv.password;
        _this.firefox();
        return _this;
    }
    Blogger.prototype.main = function () {
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
                        return [4, this.checkBlog()];
                    case 4:
                        _b.sent();
                        protocol.success();
                        return [2];
                }
            });
        });
    };
    Blogger.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var canLogin, outOfLoginPage, isLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get(this.bloggerUrl + "/go/signin")];
                    case 1:
                        _a.sent();
                        return [4, this.waitAppear('#identifierId', 5)];
                    case 2:
                        canLogin = _a.sent();
                        if (!!canLogin) return [3, 4];
                        return [4, this.captureError('Cannot find email field!')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        protocol.send('Logging in..');
                        return [4, this.type("#identifierId", this.id)];
                    case 5:
                        _a.sent();
                        return [4, this.click("#identifierNext")];
                    case 6:
                        _a.sent();
                        return [4, this.wait(3000)];
                    case 7:
                        _a.sent();
                        return [4, this.insert('input[name="password"]', this.password)];
                    case 8:
                        _a.sent();
                        return [4, this.click('#passwordNext')];
                    case 9:
                        _a.sent();
                        protocol.send('Exiting login page.');
                        return [4, this.waitDisappear('#passwordNext', 10)];
                    case 10:
                        outOfLoginPage = _a.sent();
                        if (!!outOfLoginPage) return [3, 12];
                        return [4, this.captureError('Login page timeout exceeds!')];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        protocol.send('Completing login...');
                        return [4, this.waitDisappear("html:contains('Loading')")];
                    case 13:
                        isLogin = _a.sent();
                        if (!isLogin)
                            this.captureError('Login failed script will end.');
                        protocol.send("Login", "ok");
                        return [2];
                }
            });
        });
    };
    Blogger.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blogUrl, canClickNewPost, re, canPost, isNotInPublishing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol.send('Publishing start on', argv.category);
                        blogUrl = '/blogger.g?blogID=' + argv.category;
                        protocol.send('Verifying if app can go to editor.');
                        return [4, this.waitAppear('a[href="#editor/src=sidebar"]')];
                    case 1:
                        canClickNewPost = _a.sent();
                        if (!!canClickNewPost) return [3, 3];
                        return [4, this.captureError('Cant find link for editor!')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        protocol.send('Going to editor:' + this.bloggerUrl + blogUrl + '#editor/src=sidebar');
                        return [4, this.get(this.bloggerUrl + blogUrl + '#editor/src=sidebar')];
                    case 4:
                        _a.sent();
                        protocol.send('Looking for html box.');
                        return [4, this.waitAppear("#postingHtmlBox")];
                    case 5:
                        re = _a.sent();
                        if (!re)
                            this.captureError('Cant find posting box! check internet');
                        protocol.send('Looking for html box', 'Found!');
                        protocol.send('Waiting for extra resources before writing');
                        return [4, this.waitDisappear("div:contains('Loading')")];
                    case 6:
                        canPost = _a.sent();
                        if (!canPost)
                            protocol.end('Loading exceeds timeout! Check internet.');
                        protocol.send('Writing post...');
                        return [4, this.type(".titleField", this.post.title.trim())];
                    case 7:
                        _a.sent();
                        return [4, this.insert("#postingHtmlBox", this.post.content.trim())];
                    case 8:
                        _a.sent();
                        return [4, this.click('.OYKEW4D-U-i > .blogg-primary')];
                    case 9:
                        _a.sent();
                        protocol.send('Publishing..');
                        return [4, this.waitAppear('.editPosts')];
                    case 10:
                        isNotInPublishing = _a.sent();
                        if (!isNotInPublishing)
                            protocol.send("Exiting publish page exceeds timeout! Check blog manually if properly posted.");
                        protocol.send('Publishing done');
                        return [2];
                }
            });
        });
    };
    Blogger.prototype.checkBlog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var title;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol.send('Check blog if post is successful');
                        protocol.send('Visiting the Blog:' + argv.endpoint);
                        return [4, this.get(argv.endpoint)];
                    case 1:
                        _a.sent();
                        protocol.send('Looking for title');
                        return [4, this.waitAppear(this.post.title.trim())];
                    case 2:
                        title = _a.sent();
                        if (!title)
                            this.captureError('title not found. Check it manually');
                        protocol.send('title Found!');
                        return [2];
                }
            });
        });
    };
    Blogger.prototype.captureError = function (message, imagePath) {
        if (imagePath === void 0) { imagePath = path.join(__dirname, "/../screenshot/" + lib.timeStamp() + "-blogger.png"); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.screenshot(imagePath)];
                    case 1:
                        _a.sent();
                        protocol.end('fail', message + " Check screenshot at (" + imagePath + ")");
                        return [2];
                }
            });
        });
    };
    return Blogger;
}(nightmare_1.MyNightmare));
var options = {
    show: argv.browser === 'true',
    x: 1000, y: 0, width: 800, height: 700,
    openDevTools: { mode: '' },
};
(new Blogger(options)).main();
//# sourceMappingURL=blogger.js.map