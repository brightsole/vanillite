declare type Cache = {
    [index: string]: any;
};
declare type CacheSettings = {
    lastPurge: number;
    maxCacheItems: number;
    maxCacheTimeout: number;
};
declare type VanilliteOptions = {
    maxCacheItems?: number;
    maxCacheTimeout?: number;
} & LocalForageOptions;
declare class Vanillite {
    store: LocalForage;
    cache: Cache;
    cacheSettings: CacheSettings;
    constructor(options: VanilliteOptions);
    getItem: (key: string) => Promise<unknown>;
    setItem: (key: string, value: unknown) => Promise<unknown>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
    length: () => Promise<number>;
    key: (index: number) => Promise<string>;
    keys: () => Promise<string[]>;
    private storeCacheItem;
    private stashCache;
}
export default Vanillite;
