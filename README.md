# vanillite

[<img src="vanillite.svg?sanitize=true" height=250>]()

### What is it?
<details>
  <summary>
    tl;dr: <TODO>
  </summary>
  <br />

  A brand new package project! vanillite is a wrapper around `localForage` and seeks to make writes faster by using a memory cache.

  It's ready for you to add some functionality, and publish it!

</details>
<br/>

### How to use it?
<details>
  <summary>
    tl;dr: <TODO><code>`yarn && yarn test`</code>
  </summary>
  <br />

  <TODO> Start devving after that!

</details>
<br/>

### TODO:
<details>
<summary>tl;dr: most of it</summary>
<br />

#### High priority

1. finish off mirroring used `localForage` methods
    1. iterate
    1. createInstance
1. write some tests
    1. setItem
    1. setItem for many more items than cached
    1. getItem before the cache limit
    1. getItem beyond the cache limit
    1. get some statistics as to how fast it is using a cache _(after out of the startup phase)_
1. publish the lib with types for consumption

#### Low priority

1. change all instances of `unknown` to a generic that can be specified at instantiation
2. test all remaining methods to make sure the cache isn't interfering with localforage use
3. interact with cache many times very quickly to make sure no duplication or missing data occurs when mutating the cache object and document store simultaneously

</details>
<br/>
<a href="https://www.buymeacoffee.com/Ao9uzMG" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" ></a>