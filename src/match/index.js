const _ = Symbol.for('_');
const matches = require('../matches');

module.exports = function match(term) {
  const comparator = matches(term);
  let fn = null;

  return function clause(cond, exec) {
    if (typeof exec !== 'function') {
      throw new TypeError(`Expected a function, got ${typeof exec} instead`);
    }

    /**
     * If no function has been cached, and the condition matches,
     * cache the associated function.
     *
     * Since we break on _, and _ always matches, we will always have a match.
     */
    if (fn === null && comparator(cond)) {
      fn = exec;
    }

    /**
     * When `cond` is _, stop receiving conditions and
     * execute the matching function.
     */
    if (cond === _) {
      return fn.call(this, term);
    }

    return clause;
  }
};
