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
var firebase_1 = require("../firebase");
var protocol = require("./../protocol");
var Sonub = (function (_super) {
    __extends(Sonub, _super);
    function Sonub(defaultOptions) {
        var _this = _super.call(this, defaultOptions) || this;
        _this.firefox();
        return _this;
    }
    Sonub.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, snap, post, n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protocol.set('sonub', this.argv.category);
                        date = this.date('Y-m-d H:i:s');
                        protocol.send('begin', "posting begins at: " + date);
                        return [4 /*yield*/, firebase_1.db.child('ad-write')
                                .child(this.argv.user)
                                .child(this.argv.key)
                                .once('value')];
                    case 1:
                        snap = _a.sent();
                        post = snap.val();
                        if (!post)
                            protocol.end('get-firebase-data-fail:');
                        else
                            protocol.send('get-firebase-data-ok:');
                        return [4 /*yield*/, this.get('https://www.sonub.com/user/login')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.insert('#register_user_login', this.argv.id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.insert('#register_user_pass', this.argv.password)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.click('.page-form-submit')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.waitSelectors(['.error', '.home-form-header'])];
                    case 6:
                        n = _a.sent();
                        if (n !== 1)
                            protocol.end('login-fail');
                        else
                            protocol.send('login-ok');
                        return [4 /*yield*/, this.click('#header-menu-icon')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.wait('#menu-page-header')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.click('#menu-community')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.wait('#community-header')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.click('#community-discussion-button')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.wait('#post-list-discussion')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.wait('#post-list-create-button')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, this.click('#post-list-create-button')];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, this.click('.post-create-button')];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Sonub;
}(nightmare_1.MyNightmare));
var options = {
    show: true,
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Sonub(options)).main();
//# sourceMappingURL=sonub.js.map