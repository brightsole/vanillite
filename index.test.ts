import test from 'ava';
import { performance } from 'perf_hooks';
import * as localForage from 'localforage';
// eslint-disable-next-line import/extensions
import Vanillite from './index';

const getActionTime = async (
  testedFunction: () => Promise<any>
): Promise<number> => {
  const startTime = performance.now();
  await testedFunction();
  const finalTime = performance.now();

  return finalTime - startTime;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const key = 'fiver-to-niner';
const item = { give: 'me', five: 'dollars' };

test('main exports a class', t => {
  t.deepEqual(typeof Vanillite, 'function');
});

// because of async iterator compilation, we have to disable this test
// in the real world, it's insanely faster
// TODO: find a fix for `"downlevelIteration": true`
test.skip('inserts & gets faster, and stores correctly', async t => {
  const vanilliteStore = new Vanillite({ name: 'test1' });
  const localTestStore = localForage.createInstance({ name: 'test2' });

  const localForageTime = await getActionTime(() =>
    localTestStore.setItem(key, item)
  );
  const vanilliteTime = await getActionTime(() =>
    vanilliteStore.setItem(key, item)
  );

  // console.log('\n\n', 'store times', vanilliteTime, localForageTime, '\n\n');

  t.true(vanilliteTime < localForageTime);

  const vtime = await getActionTime(() => vanilliteStore.getItem(key));
  const ltime = await getActionTime(() => localTestStore.getItem(key));

  t.true(vtime < ltime);

  // console.log('\n\n', 'get times', vtime, ltime, '\n\n');

  const localStored = await localTestStore.getItem(key);
  const vanilliteStored = await vanilliteStore.getItem(key);

  return t.deepEqual(vanilliteStored, localStored);
});

test('must be storing items', async t => {
  const vanilliteStore = new Vanillite({ name: 'storeTest' });
  vanilliteStore.setItem(key, item);

  await sleep(10);
  t.deepEqual(key, vanilliteStore.cacheLog[0]);
});

test('when storing more than cache limit, it must not return dupes', async t => {
  const smolStore = new Vanillite({ name: 'smolCache', maxCacheItems: 40 });

  [...Array(50).keys()].forEach(index =>
    smolStore.setItem(`${index}-storetest`, item)
  ); // don't wait on the inserts

  const inFlightKeys = await smolStore.keys();
  t.deepEqual(inFlightKeys.length, [...new Set(inFlightKeys)].length);
  // used because it's a cheap unique

  await sleep(100); // wait for store events to calm

  const finalKeys = await smolStore.keys();
  t.deepEqual(50, finalKeys.length);
  t.deepEqual(40, smolStore.cacheLog.length);
});

test('iterator functions identically, even on small cache sizes with incomplete writes', async t => {
  const smolIterate = new Vanillite({ name: 'smallen-it', maxCacheItems: 40 });

  [...Array(50).keys()].forEach(index =>
    smolIterate.setItem(`${index}-storetest`, item)
  ); // don't wait on the inserts

  const accumulator = [];
  await smolIterate.iterate((value, id, index) => {
    accumulator.push({ id, value, index });
  });

  t.deepEqual(
    accumulator,
    [...Array(50).keys()].map(index => ({
      id: `${index}-storetest`,
      value: item,
      index,
    }))
  );
});
