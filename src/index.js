const match = require('./match');
const matchWith = require('./matchWith');

module.exports.match = match;
module.exports.matchWith = matchWith;

module.exports._ = Symbol.for('_');
