import test from 'ava';
// eslint-disable-next-line import/extensions
import Vanillite from './index';

test('main exports a class', t => {
  t.deepEqual(typeof Vanillite, 'function');
});
