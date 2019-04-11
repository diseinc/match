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

function equals(a, b) {
  return a === b;
}

function catchAll(a, b) {
  return b === _;
}

module.exports = function matches(s0) {
  return function(s1) {
    const v0 = [].concat(s0);
    const v1 = [].concat(s1);

    if (v1.length > v0.length) { return false; }

    let m = true;
    let l = v1.length;

    while (m && l --> 0) {

      const a = v0.shift();
      const b = v1.shift();

      m = (
        fun(a, b)     ||
        regex(a, b)   ||
        equals(a, b)  ||
        catchAll(a, b)
      );
    }

    return m;
  }
};
