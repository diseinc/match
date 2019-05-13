const { Some, None } = require('../option');
const _ = Symbol.for('_');

module.exports.by_function = (value, fn) => {
  return typeof fn === 'function'
    ? Some(fn(value))
    : None();
}

module.exports.as_regex = (string, pattern) => {
  if (pattern instanceof RegExp) {
    const value = String(string).search(pattern) > -1;

    return Some(value);
  }
  else {
    return None();
  }
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
module.exports.as_object = (value, condition) => {
  const is_object = x => x instanceof Object;

  if (is_object(value) && is_object(condition)) {
    const result = Object.keys(condition).every((key) => {
      return value.hasOwnProperty(key) && value[key] === condition[key]
   });

    return Some(result);
  }
  else {
    return None();
  }
}

module.exports.catch_all = (a, b) => {
  return b === _
    ? Some(true)
    : None();
}

module.exports.equals = (a, b) => {
  return Some(a === b);
}
