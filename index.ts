import * as localForage from 'localforage';

type Cache = {
  [index: string]: any;
};

type CacheSettings = {
  lastPurge: number;
  maxCacheItems: number;
  maxCacheTimeout: number;
};

type VanilliteOptions = {
  maxCacheItems?: number;
  maxCacheTimeout?: number;
} & LocalForageOptions;

class Vanillite {
  store: LocalForage;

  cache: Cache;

  cacheSettings: CacheSettings;

  constructor(options: VanilliteOptions) {
    const { maxCacheItems = 1000, maxCacheTimeout = 1000, ...rest } = options;

    this.cacheSettings = {
      maxCacheItems,
      maxCacheTimeout,
      lastPurge: Date.now(),
    };

    this.store = localForage.createInstance(rest);

    this.cache = {};
  }

  getItem = (key: string): Promise<unknown> => {
    if (this.cache[key]) return Promise.resolve(this.cache[key]);
    return this.store.getItem(key);
  };

  setItem = (key: string, value: unknown): Promise<unknown> => {
    this.cache[key] = value;

    const atCacheLimit =
      Object.keys(this.cache).length === this.cacheSettings.maxCacheItems;
    const atCacheTimeLimit =
      Date.now() >
      this.cacheSettings.lastPurge + this.cacheSettings.maxCacheTimeout;

    if (atCacheLimit || atCacheTimeLimit) this.stashCache();

    return Promise.resolve(value);
  };

  removeItem = (key: string): Promise<void> => {
    delete this.cache[key];
    return this.store.removeItem(key);
  };

  clear = (): Promise<void> => {
    this.cache = {};
    return this.store.clear();
  };

  length = async (): Promise<number> => {
    const storeLength = await this.store.length();
    return storeLength + Object.keys(this.cache).length;
  };

  key = async (index: number): Promise<string> => {
    const key = await this.store.key(index);
    if (!key) return Object.keys(this.cache)[index];
    return key;
  };

  keys = async (): Promise<string[]> => {
    const storeKeys = await this.store.keys();
    return [...storeKeys, ...Object.keys(this.cache)];
  };

  private storeCacheItem = async (key, value) => {
    await this.store.setItem(key, value);
    delete this.cache[key];
  };

  private stashCache = () => {
    Promise.all(
      Object.entries(this.cache).map(([key, value]) =>
        this.storeCacheItem(key, value)
      )
    );
  };
}

export default Vanillite;
