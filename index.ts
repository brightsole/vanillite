import * as localForage from 'localforage';

const unique = (anyArray: Array<any>) =>
  anyArray.filter((value, index, self) => self.indexOf(value) === index);

type CacheSettings = {
  maxCacheItems: number;
};

type VanilliteOptions = {
  maxCacheItems?: number;
} & LocalForageOptions;

class Vanillite<ItemType> {
  store: LocalForage;

  /* key:value store of items held in memory up to items limits */
  cache: { [index: string]: ItemType };

  /* log of ids of successfully stored items existing in cache */
  cacheLog: Array<string>;

  cacheSettings: CacheSettings;

  constructor(options: VanilliteOptions) {
    const { maxCacheItems = 1000, ...rest } = options;

    this.store = localForage.createInstance(rest);

    this.cache = {};
    this.cacheLog = [];

    this.cacheSettings = {
      maxCacheItems,
    };
  }

  getItem = (key: string): Promise<ItemType> => {
    if (this.cache[key]) return Promise.resolve(this.cache[key]);
    return this.store.getItem(key);
  };

  setItem = (key: string, value: ItemType): Promise<ItemType> => {
    this.storeItem(key, value); // executes nonblocking

    return Promise.resolve(value);
  };

  removeItem = (key: string): Promise<void> => {
    delete this.cache[key];
    this.cacheLog = this.cacheLog.filter(cacheKey => cacheKey === key);
    return this.store.removeItem(key);
  };

  clear = (): Promise<void> => {
    this.cache = {};
    this.cacheLog = [];
    return this.store.clear();
  };

  key = async (index: number): Promise<string> => {
    const key = await this.store.key(index);
    if (!key) return Object.keys(this.cache)[index];
    return key;
  };

  keys = async (): Promise<string[]> => {
    const storeKeys = await this.store.keys();
    return unique([...storeKeys, ...Object.keys(this.cache)]);
  };

  length = async (): Promise<number> => {
    const keys = await this.keys();
    return keys.length;
  };

  iterate = async (
    iterationFunction: (value: ItemType, key: string, index: number) => void,
    finalCallback: () => void | undefined = () => {}
  ) => {
    const cacheKeys = Object.keys(this.cache);

    cacheKeys.forEach((key, index) => {
      iterationFunction(this.cache[key], key, index);
    });

    let workingIndex = cacheKeys.length;
    await this.store.iterate((value, key) => {
      if (cacheKeys.includes(key)) return; // FILTER DUPES

      workingIndex += 1;
      iterationFunction(value as ItemType, key, workingIndex);
    });

    return Promise.resolve(finalCallback());
  };

  createInstance = (options: VanilliteOptions & LocalForageOptions) => {
    return new Vanillite(options);
  };

  dropInstance = async () => {
    await this.clear();
    return this.store.dropInstance();
  };

  private storeItem = async (key, value) => {
    this.cache[key] = value;

    await this.store.setItem(key, value);
    this.cacheLog.push(key);
    this.downsizeCache();
  };

  private downsizeCache = () => {
    const exceededCache =
      this.cacheLog.length - this.cacheSettings.maxCacheItems;

    if (exceededCache >= 5) this.unloadOldest(exceededCache);
    // this is to reduce the number of calls, cache size should hardly be affected by +5
  };

  private unloadOldest = (toUnload: number) => {
    const oldestIds = this.cacheLog.slice(0, toUnload);
    const allowedCache = this.cacheLog.slice(toUnload);

    oldestIds.forEach(oldItemId => {
      delete this.cache[oldItemId];
    });
    this.cacheLog = allowedCache;
  };
}

export default Vanillite;
