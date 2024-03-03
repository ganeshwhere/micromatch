'use strict';

require('mocha');
const path = require('path');
const assert = require('assert');
const mm = require('..');

const isWindows = () => process.platform === 'win32' || path.sep === '\\';
const formatPath = str => str.replace(/\\/g, '/').replace(/^\.\//, '');

const fixtures = ['\\\\', '*', '**', '\\*', 'a', 'a/*', 'abc', 'abd', 'abe', 'b', 'bb', 'bcd', 'bdir/', 'Beware', 'c', 'ca', 'cb', 'd', 'dd', 'de'];

describe('Bash options and features:', () => {
  describe('Bash patterns:', () => {
    it('should handle "regular globbing"', () => {
      assert.deepEqual(mm(fixtures, 'a*'), ['a', 'abc', 'abd', 'abe']);
      assert.deepEqual(mm(fixtures, '\\a*'), ['a', 'abc', 'abd', 'abe']);
    });

    it('should match directories', () => {
      assert.deepEqual(mm(fixtures, 'b*/'), ['bdir/']);
    });

    // More tests...
  });

  describe('Wildmat features:', () => {
    it('should handle basic wildmat features', () => {
      assert(!mm.isMatch('foo', '*f'));
      assert(!mm.isMatch('foo', '??'));
      assert(!mm.isMatch('foo', 'bar'));
      assert(!mm.isMatch('foobar', 'foo\\*bar'));
      assert(mm.isMatch('?a?b', '\\??\\?b'));
      assert(mm.isMatch('aaaaaaabababab', '*ab'));
      assert(mm.isMatch('f\\oo', 'f\\oo'));
      assert(mm.isMatch('foo', '*'));
      assert(mm.isMatch('foo', '*foo*'));
      assert(mm.isMatch('foo', '???'));
      assert(mm.isMatch('foo', 'f*'));
      assert(mm.isMatch('foo', 'foo'));
      assert(mm.isMatch('foo*', 'foo\\*', { toPosixSlashes: false }));
      assert(mm.isMatch('foobar', '*ob*a*r*'));
    });

    // More tests...
  });

  // More groups of tests...
});
