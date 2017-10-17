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
require('nightmare-upload')(nightmare_1.MyNightmare);
var argv = require('yargs').string('category').argv;
var protocol = require("./../protocol");
var lib = require("../auto-post-library");
var path = require("path");
var fs = require("fs");
if (argv.pid === void 0) {
    console.log('no pid');
    process.exit(1);
}
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
var Olx = (function (_super) {
    __extends(Olx, _super);
    function Olx(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.olxUrl = 'https://www.olx.ph';
        _this.post = null;
        _this.id = argv.id;
        _this.password = argv.password;
        _this.firefox();
        return _this;
    }
    Olx.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.post = {
                            title: 'This is title',
                            content: "<p>This is the <strong>post</strong></p>klsd;lsd;lg lksjgk;lsj ;lskdjfg;lksdjfg; ;lksdjfg; skdjfg;lksj lk;sdjfg;lksdjf ;lksdjf;glksj;kj dkgjl ",
                            price: "13400",
                            condition: '2nd hand'
                        };
                        return [4, this.login()];
                    case 1:
                        _a.sent();
                        return [4, this.publish()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Olx.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var canLogin, isLogin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.get(this.olxUrl + '/login')];
                    case 1:
                        _a.sent();
                        protocol.send('Waiting to login...');
                        return [4, this.waitAppear('input[name="mobile"]', 5)];
                    case 2:
                        canLogin = _a.sent();
                        if (!!canLogin) return [3, 4];
                        return [4, this.captureError("Can't find mobile field.")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        protocol.send('Clear fields.');
                        return [4, this.insert('input[name="mobile"]', '')];
                    case 5:
                        _a.sent();
                        return [4, this.insert('input[name="password"]', '')];
                    case 6:
                        _a.sent();
                        protocol.send('Login..');
                        return [4, this.insert('input[name="mobile"]', this.id)];
                    case 7:
                        _a.sent();
                        return [4, this.insert('input[name="password"]', this.password)];
                    case 8:
                        _a.sent();
                        return [4, this.enter('input[name="password"]')];
                    case 9:
                        _a.sent();
                        protocol.send('Waiting for profile.');
                        return [4, this.waitAppear('.profile')];
                    case 10:
                        isLogin = _a.sent();
                        if (!!isLogin) return [3, 12];
                        return [4, this.captureError('Profile not found.')];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2];
                }
            });
        });
    };
    Olx.prototype.publish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var canPost, canSell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol.send('Waiting for /ad/post link');
                        return [4, this.waitAppear('a[href="/ad/post"]')];
                    case 1:
                        canPost = _a.sent();
                        if (!!canPost) return [3, 3];
                        return [4, this.captureError('Cant find link for /ad/post')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        protocol.send('Goto: ' + this.olxUrl + '/ad/post');
                        return [4, this.get(this.olxUrl + '/ad/post')];
                    case 4:
                        _a.sent();
                        protocol.send('Waiting for sell form.');
                        return [4, this.waitAppear('.sell-form')];
                    case 5:
                        canSell = _a.sent();
                        if (!!canSell) return [3, 7];
                        return [4, this.captureError('Cannot find sell form!')];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        protocol.send('Posting for computer.');
                        this.computers(this.post);
                        return [2];
                }
            });
        });
    };
    Olx.prototype.captureError = function (message, filePath, fileName) {
        if (filePath === void 0) { filePath = path.join(__dirname, '..', 'screenshot'); }
        if (fileName === void 0) { fileName = lib.timeStamp() + '-olx.png'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(filePath))
                            fs.mkdirSync(filePath);
                        return [4, this.screenshot(path.join(filePath, fileName))];
                    case 1:
                        _a.sent();
                        protocol.fail(message + 'Check screenshot at :' + path.join(filePath, fileName));
                        return [2];
                }
            });
        });
    };
    Olx.prototype.computers = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var description, category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        description = lib.textify(post.content).trim();
                        if (!(description.length < 40)) return [3, 2];
                        return [4, protocol.fail('Description/Content cannot be shorter than 40 characters.')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        protocol.send('Selecting category');
                        category = argv.category.split('.');
                        return [4, this.click('#category-btn').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 3:
                        _a.sent();
                        return [4, this.click('.category-' + category[0].trim().toLowerCase()).then(function (a) { return a; }).catch(function (e) { return _this.captureError('Invalid Category!'); })];
                    case 4:
                        _a.sent();
                        return [4, this.click('.category-' + category[1].trim().toLowerCase()).then(function (a) { return a; }).catch(function (e) { return _this.captureError('Invalid Category!'); })];
                    case 5:
                        _a.sent();
                        protocol.send('Uploading photo..');
                        return [4, this.upload('input[accept="image/jpeg,image/gif,image/png"]', path.join(__dirname, '..', 'screenshot', '2017-10-11-11-32-59-twitter.png')).then(function (a) { return a; }).catch(function (e) { return console.log(e); })];
                    case 6:
                        _a.sent();
                        protocol.send('Selecting item condition');
                        if (!post.condition.toLowerCase().indexOf('new')) return [3, 8];
                        return [4, this.select('#param_condition', '1').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        ;
                        if (!post.condition.toLowerCase().indexOf('used')) return [3, 10];
                        return [4, this.select('#param_condition', '2').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        ;
                        if (!post.condition.toLowerCase().indexOf('2nd')) return [3, 12];
                        return [4, this.select('#param_condition', '2').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        ;
                        if (!post.condition.toLowerCase().indexOf('second')) return [3, 14];
                        return [4, this.select('#param_condition', '2').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        ;
                        protocol.send('Selecting location');
                        return [4, this.click('#location-btn').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 15:
                        _a.sent();
                        return [4, this.click('#location-1').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 16:
                        _a.sent();
                        return [4, this.click('#location-1').then(function (a) { return a; }).catch(function (e) { return _this.captureError(e); })];
                    case 17:
                        _a.sent();
                        protocol.send('Typing into fields');
                        return [4, this.type('#title', post.title)];
                    case 18:
                        _a.sent();
                        return [4, this.type('#param_price', post.price)];
                    case 19:
                        _a.sent();
                        return [4, this.type('#description', description)];
                    case 20:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return Olx;
}(nightmare_1.MyNightmare));
var options = {
    show: argv.browser === 'true',
    x: 1072, y: 0, width: 850, height: 700,
};
(new Olx(options)).main();
//# sourceMappingURL=olx.js.map