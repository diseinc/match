const ok  = Symbol.for('ok');
const err = Symbol.for('err');
const _   = Symbol.for('_');

const unwrap = require('./unwrap');
const matches = require('./matches');
const match = require('./match');


module.exports = { ok, err, _, unwrap, matches, match };
