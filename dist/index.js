"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var localForage = require("localforage");
var Vanillite = /** @class */ (function () {
    function Vanillite(options) {
        var _this = this;
        this.getItem = function (key) {
            if (_this.cache[key])
                return Promise.resolve(_this.cache[key]);
            return _this.store.getItem(key);
        };
        this.setItem = function (key, value) {
            _this.cache[key] = value;
            var atCacheLimit = Object.keys(_this.cache).length === _this.cacheSettings.maxCacheItems;
            var atCacheTimeLimit = Date.now() >
                _this.cacheSettings.lastPurge + _this.cacheSettings.maxCacheTimeout;
            if (atCacheLimit || atCacheTimeLimit)
                _this.stashCache();
            return Promise.resolve(value);
        };
        this.removeItem = function (key) {
            delete _this.cache[key];
            return _this.store.removeItem(key);
        };
        this.clear = function () {
            _this.cache = {};
            return _this.store.clear();
        };
        this.length = function () { return __awaiter(_this, void 0, void 0, function () {
            var storeLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.length()];
                    case 1:
                        storeLength = _a.sent();
                        return [2 /*return*/, storeLength + Object.keys(this.cache).length];
                }
            });
        }); };
        this.key = function (index) { return __awaiter(_this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.key(index)];
                    case 1:
                        key = _a.sent();
                        if (!key)
                            return [2 /*return*/, Object.keys(this.cache)[index]];
                        return [2 /*return*/, key];
                }
            });
        }); };
        this.keys = function () { return __awaiter(_this, void 0, void 0, function () {
            var storeKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.keys()];
                    case 1:
                        storeKeys = _a.sent();
                        return [2 /*return*/, __spreadArrays(storeKeys, Object.keys(this.cache))];
                }
            });
        }); };
        this.storeCacheItem = function (key, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.setItem(key, value)];
                    case 1:
                        _a.sent();
                        delete this.cache[key];
                        return [2 /*return*/];
                }
            });
        }); };
        this.stashCache = function () {
            Promise.all(Object.entries(_this.cache).map(function (_a) {
                var key = _a[0], value = _a[1];
                return _this.storeCacheItem(key, value);
            }));
        };
        var _a = options.maxCacheItems, maxCacheItems = _a === void 0 ? 1000 : _a, _b = options.maxCacheTimeout, maxCacheTimeout = _b === void 0 ? 1000 : _b, rest = __rest(options, ["maxCacheItems", "maxCacheTimeout"]);
        this.cacheSettings = {
            maxCacheItems: maxCacheItems,
            maxCacheTimeout: maxCacheTimeout,
            lastPurge: Date.now()
        };
        this.store = localForage.createInstance(rest);
        this.cache = {};
    }
    return Vanillite;
}());
exports["default"] = Vanillite;
