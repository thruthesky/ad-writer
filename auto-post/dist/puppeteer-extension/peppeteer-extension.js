"use strict";
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
var puppeteer = require('puppeteer');
var cheerio = require("cheerio");
var PuppeteerExtension = (function () {
    function PuppeteerExtension() {
        this.ua = {
            firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:54.0) Gecko/20100101 Firefox/54.0",
            chrome: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
        };
    }
    PuppeteerExtension.prototype.firefox = function () {
        this.page.setUserAgent(this.ua.firefox);
    };
    PuppeteerExtension.prototype.chrome = function () {
        this.page.setUserAgent(this.ua.chrome);
    };
    PuppeteerExtension.prototype.set = function (browser, page) {
        this.browser = browser;
        this.page = page;
    };
    PuppeteerExtension.prototype.html = function () {
        return __awaiter(this, void 0, void 0, function () {
            var html, $html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$eval('html', function (html) { return html.outerHTML; })];
                    case 1:
                        html = _a.sent();
                        $html = cheerio.load(html)('html');
                        return [2 /*return*/, $html];
                }
            });
        });
    };
    PuppeteerExtension.prototype.insert = function (selector, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.waitFor(100)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.page.focus(selector)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitFor(100)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.page.type(text)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.page.waitFor(100)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PuppeteerExtension.prototype.waitAppear = function (selectors, timeout) {
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
                        if (!(i < maxWaitCount)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.page.waitFor(100)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.html()];
                    case 3:
                        $html = _a.sent();
                        for (i_1 = 0; i_1 < selectors.length; i_1++) {
                            if ($html.find(selectors[i_1]).length > 0)
                                return [2 /*return*/, i_1];
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, -1];
                }
            });
        });
    };
    PuppeteerExtension.prototype.waitDisappear = function (selector, timeout) {
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
                        if (!(i < maxWaitCount)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.page.waitFor(100)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.html()];
                    case 3:
                        $html = _a.sent();
                        if ($html.find(selector).length === 0)
                            return [2 /*return*/, true];
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, false];
                }
            });
        });
    };
    PuppeteerExtension.prototype.waitUntil = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return PuppeteerExtension;
}());
exports.PuppeteerExtension = PuppeteerExtension;
//# sourceMappingURL=peppeteer-extension.js.map