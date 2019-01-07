const ok  = Symbol.for('ok');
const err = Symbol.for('err');
const _   = Symbol.for('_');

const matches = require('./matches');
const match = require('./match');


module.exports = { ok, err, _, matches, match };
