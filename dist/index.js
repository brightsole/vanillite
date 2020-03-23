"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const localForage = __importStar(require("localforage"));
const unique = (anyArray) => anyArray.filter((value, index, self) => self.indexOf(value) === index);
class Vanillite {
    constructor(options) {
        this.getItem = (key) => {
            if (this.cache[key])
                return Promise.resolve(this.cache[key]);
            return this.store.getItem(key);
        };
        this.setItem = (key, value) => {
            this.storeItem(key, value); // executes nonblocking
            return Promise.resolve(value);
        };
        this.removeItem = (key) => {
            delete this.cache[key];
            this.cacheLog = this.cacheLog.filter(cacheKey => cacheKey === key);
            return this.store.removeItem(key);
        };
        this.clear = () => {
            this.cache = {};
            this.cacheLog = [];
            return this.store.clear();
        };
        this.key = async (index) => {
            const key = await this.store.key(index);
            if (!key)
                return Object.keys(this.cache)[index];
            return key;
        };
        this.keys = async () => {
            const storeKeys = await this.store.keys();
            return unique([...storeKeys, ...Object.keys(this.cache)]);
        };
        this.length = async () => {
            const keys = await this.keys();
            return keys.length;
        };
        this.iterate = async (iterationFunction, finalCallback = () => { }) => {
            const cacheKeys = Object.keys(this.cache);
            cacheKeys.forEach((key, index) => {
                iterationFunction(this.cache[key], key, index);
            });
            let workingIndex = cacheKeys.length;
            await this.store.iterate((value, key) => {
                if (cacheKeys.includes(key))
                    return; // FILTER DUPES
                workingIndex += 1;
                iterationFunction(value, key, workingIndex);
            });
            return Promise.resolve(finalCallback());
        };
        this.createInstance = (options) => {
            return new Vanillite(options);
        };
        this.dropInstance = async () => {
            await this.clear();
            return this.store.dropInstance();
        };
        this.storeItem = async (key, value) => {
            this.cache[key] = value;
            await this.store.setItem(key, value);
            this.cacheLog.push(key);
            this.downsizeCache();
        };
        this.downsizeCache = () => {
            const exceededCache = this.cacheLog.length - this.cacheSettings.maxCacheItems;
            if (exceededCache >= 5)
                this.unloadOldest(exceededCache);
            // this is to reduce the number of calls, cache size should hardly be affected by +5
        };
        this.unloadOldest = (toUnload) => {
            const oldestIds = this.cacheLog.slice(0, toUnload);
            const allowedCache = this.cacheLog.slice(toUnload);
            oldestIds.forEach(oldItemId => {
                delete this.cache[oldItemId];
            });
            this.cacheLog = allowedCache;
        };
        const { maxCacheItems = 1000 } = options, rest = __rest(options, ["maxCacheItems"]);
        this.store = localForage.createInstance(rest);
        this.cache = {};
        this.cacheLog = [];
        this.cacheSettings = {
            maxCacheItems,
        };
    }
}
exports.default = Vanillite;
