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
var Nightmare = require("nightmare");
var datetime_1 = require("locutus/php/datetime");
var c = require('cheerio');
var argv = require('yargs').string('catergory').argv;
var MyNightmare = (function (_super) {
    __extends(MyNightmare, _super);
    function MyNightmare(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.ua = {
            firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
            chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
        };
        return _this;
    }
    MyNightmare.prototype.firefox = function () {
        this.useragent(this.ua.firefox);
    };
    MyNightmare.prototype.chrome = function () {
        this.useragent(this.ua.chrome);
    };
    MyNightmare.prototype.get = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var html, $html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this
                            .goto(url)
                            .evaluate(function () { return document.querySelector('html').innerHTML; })
                            .then(function (a) { return a; })];
                    case 1:
                        html = _a.sent();
                        $html = c.load(html)('html');
                        return [2, $html];
                }
            });
        });
    };
    MyNightmare.prototype.getHtml = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, $html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this
                            .evaluate(function () { return document.querySelector('html').innerHTML; })
                            .then(function (a) { return a; })];
                    case 1:
                        html = _a.sent();
                        $html = c.load(html)('html');
                        return [2, $html];
                }
            });
        });
    };
    MyNightmare.prototype.waitTest = function (selector, message) {
        return __awaiter(this, void 0, void 0, function () {
            var $html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.wait(selector)];
                    case 1:
                        _a.sent();
                        return [4, this.getHtml()];
                    case 2:
                        $html = _a.sent();
                        this.test($html.find(selector).length > 0, message);
                        return [2];
                }
            });
        });
    };
    MyNightmare.prototype.test = function (re, message) {
        if (re)
            this.success(message);
        else
            this.failure(message);
    };
    MyNightmare.prototype.success = function (message) {
        console.log("SUCCESS : " + message);
    };
    MyNightmare.prototype.failure = function (message) {
        console.log("FAILURE : " + message);
    };
    MyNightmare.prototype.nextAction = function (message) {
        console.log("NEXT ACTION : " + message);
    };
    Object.defineProperty(MyNightmare.prototype, "argv", {
        get: function () {
            return argv;
        },
        enumerable: true,
        configurable: true
    });
    MyNightmare.prototype.enter = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.type(selector, "\x0d")];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    MyNightmare.prototype.typeEnter = function (selector, str) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.type(selector, str)];
                    case 1:
                        _a.sent();
                        return [4, this.enter(selector)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MyNightmare.prototype.typeEnterWait = function (type, str, wait) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.typeEnter(type, str)];
                    case 1:
                        _a.sent();
                        return [4, this.wait(wait)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MyNightmare.prototype.clickWaitTest = function (click, wait, msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.click(click)];
                    case 1:
                        _a.sent();
                        return [4, this.waitTest(wait, msg)];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    MyNightmare.prototype._exit = function (msg) {
        if (msg === void 0) { msg = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (msg)
                    console.log(msg);
                process.exit(0);
                return [2];
            });
        });
    };
    MyNightmare.prototype.waitDisappear = function (selector, timeout) {
        if (timeout === void 0) { timeout = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var $html, maxWaitCount, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $html = null;
                        maxWaitCount = timeout * 1000 / 100;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxWaitCount)) return [3, 5];
                        return [4, this.wait(100)];
                    case 2:
                        _a.sent();
                        return [4, this.getHtml()];
                    case 3:
                        $html = _a.sent();
                        if ($html.find(selector).length === 0)
                            return [2, true];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5: return [2, false];
                }
            });
        });
    };
    MyNightmare.prototype.waitAppear = function (selector, timeout) {
        if (timeout === void 0) { timeout = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var $html, maxWaitCount, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $html = null;
                        maxWaitCount = timeout * 1000 / 100;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxWaitCount)) return [3, 5];
                        return [4, this.wait(100)];
                    case 2:
                        _a.sent();
                        return [4, this.getHtml()];
                    case 3:
                        $html = _a.sent();
                        if ($html.find(selector).length > 0)
                            return [2, true];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5: return [2, false];
                }
            });
        });
    };
    MyNightmare.prototype.waitSelectorExist = function (trueSelector, falseSelector, timeout) {
        if (timeout === void 0) { timeout = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var $html, maxWaitCount, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $html = null;
                        maxWaitCount = timeout * 1000 / 100;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxWaitCount)) return [3, 5];
                        return [4, this.wait(100)];
                    case 2:
                        _a.sent();
                        return [4, this.getHtml()];
                    case 3:
                        $html = _a.sent();
                        if ($html.find(trueSelector).length > 0)
                            return [2, true];
                        if ($html.find(falseSelector).length > 0)
                            return [2, false];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5: return [2, false];
                }
            });
        });
    };
    MyNightmare.prototype.waitSelectors = function (selectors, timeout) {
        if (timeout === void 0) { timeout = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var $html, maxWaitCount, i, i_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $html = null;
                        maxWaitCount = timeout * 1000 / 100;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < maxWaitCount)) return [3, 5];
                        return [4, this.wait(100)];
                    case 2:
                        _a.sent();
                        return [4, this.getHtml()];
                    case 3:
                        $html = _a.sent();
                        for (i_1 = 0; i_1 < selectors.length; i_1++) {
                            if ($html.find(selectors[i_1]).length > 0)
                                return [2, i_1];
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3, 1];
                    case 5: return [2, -1];
                }
            });
        });
    };
    MyNightmare.prototype.date = function (format, timestamp) {
        return datetime_1.date(format, timestamp);
    };
    return MyNightmare;
}(Nightmare));
exports.MyNightmare = MyNightmare;
//# sourceMappingURL=nightmare.js.map