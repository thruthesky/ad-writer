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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var protocol = require("./../protocol");
var lib = require("../auto-post-library");
var firebase_1 = require("../firebase");
if (argv.pid === void 0) {
    console.log('no pid');
    process.exit(1);
}
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
var Twitter = (function (_super) {
    __extends(Twitter, _super);
    function Twitter(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.twitterUrl = 'https://mobile.twitter.com';
        _this.post = null;
        _this.id = argv.id;
        _this.password = argv.password;
        _this.firefox();
        return _this;
    }
    Twitter.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, firebase_1.getPost(argv.user, argv.key)];
                    case 1:
                        _a.post = _b.sent();
                        if (this.post === null)
                            protocol.end('fail', 'failed to get post from firebase');
                        else
                            protocol.send('got post from firebase');
                        return [4 /*yield*/, this.login()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.publish()];
                    case 3:
                        _b.sent();
                        protocol.end('Success', 'task finished');
                        return [2 /*return*/];
                }
            });
        });
    };
    Twitter.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol.send("Logging in..");
                        return [4 /*yield*/, this.get(this.twitterUrl + '/login')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.insert('input[name="session[username_or_email]"]', this.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.typeEnter('input[name="session[password]"]', this.password)];
                    case 3:
                        _a.sent();
                        protocol.send("Checking user log in...");
                        return [4 /*yield*/, this.waitDisappear('input[name="session[password]"]')];
                    case 4:
                        isLogin = _a.sent();
                        if (!isLogin)
                            this.error("Login");
                        protocol.send("Login", 'success');
                        return [2 /*return*/];
                }
            });
        });
    };
    Twitter.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, postThis, canPost, isTweeted, articleLoaded, isProfileLoaded, arr, selector, tweetFound;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = this.post.title + '\n' + lib.textify(this.post.content);
                        postThis = content.trim();
                        protocol.send("Go to compose tweet page.");
                        return [4 /*yield*/, this.get(this.twitterUrl + "/compose/tweet")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitAppear('textArea[placeholder="What\'s happening?"]')];
                    case 2:
                        canPost = _a.sent();
                        if (!!canPost) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.error('Cant find tweet text area!')];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        protocol.send("Compose Tweet");
                        return [4 /*yield*/, this.insert('textArea[placeholder="What\'s happening?"]', postThis)];
                    case 5:
                        _a.sent();
                        protocol.send("Click tweet button.");
                        return [4 /*yield*/, this.click('div[data-testid="tweet-button"]')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.waitDisappear('textArea[placeholder="What\'s happening?"]', 5)];
                    case 7:
                        isTweeted = _a.sent();
                        if (!isTweeted)
                            this.error('Composing tweet timeout exceeds!');
                        protocol.send("Click tweet button", 'Out of tweet page.');
                        protocol.send('Waiting for articles.');
                        return [4 /*yield*/, this.waitAppear('div[role="article"]')];
                    case 8:
                        articleLoaded = _a.sent();
                        if (!articleLoaded)
                            this.error('Articles not properly loaded');
                        protocol.send('Waiting for articles', 'Articles Found! Success');
                        protocol.send("Going to " + this.twitterUrl + "/" + argv.category);
                        return [4 /*yield*/, this.get(this.twitterUrl + "/" + argv.category)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.waitAppear("div:contains('Edit profile')")];
                    case 10:
                        isProfileLoaded = _a.sent();
                        if (!isProfileLoaded)
                            this.error('Profile page not loaded properly.');
                        protocol.send("Going to " + this.twitterUrl + "/" + argv.category, "success Edit profile button found");
                        protocol.send("Verifying Tweet task...");
                        arr = postThis.split('\n');
                        selector = "span:contains('" + arr[0].trim() + "')";
                        return [4 /*yield*/, this.waitAppear(selector, 5)];
                    case 11:
                        tweetFound = _a.sent();
                        if (!tweetFound)
                            this.error("Checking Tweet", "Tweet not found!");
                        protocol.send("Checking Tweet", 'Tweet found! Success');
                        return [2 /*return*/];
                }
            });
        });
    };
    Twitter.prototype.error = function (message, path) {
        if (path === void 0) { path = __dirname + "/../screenshot/twitter.png"; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.screenshot(path)];
                    case 1:
                        _a.sent();
                        protocol.end(message + " Check screenshot at (" + path + ")", 'Failed! exit on error().');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Twitter;
}(nightmare_1.MyNightmare));
var options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Twitter(options)).main();
//# sourceMappingURL=twitter.js.map