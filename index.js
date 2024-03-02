'use strict';

const picomatch = require('picomatch');

const micromatch = (list, patterns, options) => {
  patterns = Array.isArray(patterns) ? patterns : [patterns];
  list = Array.isArray(list) ? list : [list];

  const keep = new Set();
  const omit = new Set();
  let negatives = 0;

  for (const pattern of patterns) {
    const isMatch = picomatch(pattern, options);
    const negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (const item of list) {
      const matched = isMatch(item, true);
      const match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  const result = negatives === patterns.length ? list : [...keep];
  return result.filter(item => !omit.has(item));
};

micromatch.matcher = (pattern, options) => picomatch(pattern, options);

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

micromatch.any = micromatch.isMatch;

micromatch.not = (list, patterns, options = {}) => {
  patterns = Array.isArray(patterns) ? patterns.map(String) : [String(patterns)];
  const result = new Set();
  const items = micromatch(list, patterns, options);
  items.forEach(item => {
    if (!patterns.includes(item)) {
      result.add(item);
    }
  });
  return [...result];
};

// Add other micromatch functions as needed

module.exports = micromatch;
