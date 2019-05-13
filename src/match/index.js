const matches = require('../matches');

const NoMatchingClauseError = new Error('No matching clause could be found');
const NoClausesProvidedError = new Error('No clauses provided to match against');

const { fromNullable } = require('../option');

const find = (xs, f) => fromNullable(xs.find(f));

function evaluate(clauses, value) {
  if (!clauses.length) throw NoClausesProvidedError;

  const matching_clause = clauses.find(([cond]) => matches(value, cond));

  return  find(clauses, ([cond]) => matches(value, cond))
    .match({
      Some: ([_, fn]) => fn(value),
      None: _ => { throw NoMatchingClauseError }
    });
};

const match =
  clauses =>
    (cond_or_value, fn) => fn
      ? match(clauses.concat([[cond_or_value, fn]]))
      : evaluate(clauses, cond_or_value);

module.exports = match([]);
