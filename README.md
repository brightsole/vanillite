# vanillite

[<img src="vanillite.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    tl;dr: localforage + write cache
  </summary>
  <br />

  Vanillite is a wrapper around localforage. It seeks to leave the main-used functionality unused. It, unlike localforage, wants to move **lightning-fast**.

  the default cache option allows for storing 1000 items in memory at a time, always the latest things stored. It also makes writes drop out of time, so you don't have to wait to get your item back. This improves performance **alot**. Against a stubbed lib that is even faster than localforage, it was beating it by about 2->4 orders of magnitude. most "writes" happened in less than 0.5ms.

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: npm i @brightsole/vanillite
  </summary>
  <br />

  <TODO> Start devving after that!

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: most of it</summary>
<br />

#### Low priority
1. add weirdness of instantiation to 100% mirror localforage
1. test all remaining methods to validate it is compatible with a bare localforage installation
1. investigate different cache constructions than `last in`

</details>
<br/>
<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>