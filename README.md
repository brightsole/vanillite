# vanillite

[<img src="vanillite.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    <strong>tl;dr:</strong> localforage + write cache
  </summary>
  <br />

  Vanillite is a wrapper around localforage. It seeks to leave the main-used functionality unused. It, unlike localforage, wants to move **lightning-fast**.

  the default cache option allows for storing 1000 items in memory at a time, always the latest things stored. It also makes writes drop out of time, so you don't have to wait to get your item back. This improves performance **alot**. Against a stubbed lib that is even faster than localforage, it was beating it by about 2->4 orders of magnitude. most "writes" happened in less than 0.5ms.

</details>
<br/>

### How to use it?
<details>
  <summary>
    <strong>tl;dr:</strong> <code>npm i @brightsole/vanillite</code>
  </summary>
  <br />

  import it and use it, just like localforage!

  ```js
    import Vanillite from '@brightsole/vanillite';

    const fastStore = new Vanillite({ name: 'cards' });

    const item = await fastStore.setItem(nanoId(), { some: 'stuff' });

    const allItemIds = await fastStore.keys();
  ```

</details>
<br/>

### TODO:
<details>
  <summary>
    <strong>tl;dr:</strong> low importance cleanup
  </summary>
<br />

#### Low priority
1. write more readme on how to set cache settings
1. add weirdness of instantiation to 100% mirror localforage
1. test all remaining methods to validate it is compatible with a bare localforage installation
1. investigate different cache constructions than `last in`

</details>
<br/>
<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>