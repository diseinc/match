const _ = Symbol.for('_');

function fun(value, fn) {
  if (typeof fn !== 'function') {
    return false;
  }

  return fn(value);
}

function regex(string, pattern) {
  if (!(pattern instanceof RegExp)) {
    return false;
  }

  if (typeof string === 'symbol') {
    return false;
  }

  return String(string).search(pattern) >= 0;
}

/**
 * Returns true if condition is a subset of, or equal to needle,
 * shallowly. E.g:
 * * ------------------------------- *
 * |  needle   | condition | result  |
 * | --------- | --------- | ------- |
 * |  { a }    | { a }     | true    |
 * |  { a, b } | { a }     | true    |
 * |  { a, b } | { c }     | false   |
 * |  { a }    | { a, c }  | false   |
 * * ------------------------------- *
 */
function obj(needle, condition) {
  if (typeof needle !== 'object')    return false;
  if (typeof condition !== 'object') return false;

  const conditionKeys = Object.keys(condition);

  for (const k of conditionKeys) {
    if (!needle.hasOwnProperty(k))      return false;
    if (!(needle[k] === condition[k]))  return false;
  }

  return true;
}

function equals(a, b) {
  return a === b;
}

function catchAll(a, b) {
  return b === _;
}

/**
 * @todo use some sort of monadic structure for evaluation.
 *        that would allow us to use false as a default, while
 *        being able to break as soon as we get a positive hit.
 *
 *        maybe.
 *        maybe not.
 *
 *
 * @todo add better support for checking tpyes against type and instances against instances?
 * @todo stricter equality checks? don't turn everything into an array?
 */
module.exports = function matches(s0) {
  return function(s1) {
    const v0 = [].concat(s0);
    const v1 = [].concat(s1);

    /**
     * Handle a few edge cases, like
     * _    matches a      -> true
     * [a]  matches [a, b] -> false
     * []   matches []     -> true
     * []   matches [a]    -> false
     */
    if (s1 === _)              return true;
    if (v1.length > v0.length) return false;
    if (v1.length === 0 && v0.length === 0) return true;
    if (v1.length === 0 && v0.length > 0) return false;

    let matched = true;
    let l = v1.length;

    while (matched && l --> 0) {
      const a = v0.shift();
      const b = v1.shift();

      matched = (
        fun(a, b)       ||
        obj(a, b)       ||
        regex(a, b)     ||
        equals(a, b)    ||
        catchAll(a, b)
      );
    }

    return matched;
  }
};
