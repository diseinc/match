const _ = Symbol.for('_');
const unwrap = require('../unwrap');

function regex(string, pattern) {
  if (!(pattern instanceof RegExp)) {
    return false;
  }

  if (typeof string === 'symbol') {
    return false;
  }

  return String(string).search(pattern) >= 0;
}

module.exports = function matches(s0) {
  return function(s1) {
    const v0 = unwrap(s0).slice();
    const v1 = unwrap(s1).slice();

    if (v1.length > v0.length) { return false; }

    let m = true;
    let l = v1.length;

    while (m && l --> 0) {
      const a = v0.shift();
      const b = v1.shift();

      m = (
        regex(a, b) ||
        a === b     ||
        b === _
      );
    }

    return m;
  }
};
