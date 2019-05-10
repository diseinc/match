const match = require('../match');
const _ = Symbol.for('_');

const matchWith = (value, _match) =>
  (cond, fn) => cond === _
    ?  _match(cond, fn)(value)
    : matchWith(value, _match(cond, fn))

module.exports = (value) =>
  (cond, fn) => matchWith(value, match(cond, fn));
