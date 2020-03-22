declare type CacheSettings = {
    maxCacheItems: number;
};
declare type VanilliteOptions = {
    maxCacheItems?: number;
} & LocalForageOptions;
declare class Vanillite<ItemType> {
    store: LocalForage;
    cache: {
        [index: string]: ItemType;
    };
    cacheLog: Array<string>;
    cacheSettings: CacheSettings;
    constructor(options: VanilliteOptions);
    getItem: (key: string) => Promise<ItemType>;
    setItem: (key: string, value: ItemType) => Promise<ItemType>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
    key: (index: number) => Promise<string>;
    keys: () => Promise<string[]>;
    length: () => Promise<number>;
    iterate: (iterationFunction: (value: ItemType, key: string, index: number) => void, finalCallback?: () => void) => Promise<void>;
    createInstance: (options: VanilliteOptions) => Vanillite<unknown>;
    dropInstance: () => Promise<void>;
    private storeItem;
    private downsizeCache;
    private unloadOldest;
}
export default Vanillite;
