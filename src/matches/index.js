const _ = Symbol.for('_');
const {
  by_function,
  as_regex,
  as_object,
  catch_all,
  equals
} = require('../compare');


/* Util function */
function curry(fn) {
  return function collect(...args) {
    return args.length === fn.length
      ? fn(...args)
      : collect.bind(null, ...args)
  };
};

function matches(value, cond) {
  if (Array.isArray(value) && Array.isArray(cond)) {
    const matchingLengths = value.length === cond.length;
    const matchingElements = value.every((a, i) => {
      const b = cond[i];

      return matches(a, b);
    });

    return matchingLengths && matchingElements;
  }
  else {
    return by_function(value, cond)
      .or_else(() => as_regex(value, cond))
      .or_else(() => as_object(value, cond))
      .or_else(() => catch_all(value, cond))
      .or_else(() => equals(value, cond))
      .match({
        Some: x => x,
        None: _ => false
      });
  }

}

module.exports = curry(matches);
