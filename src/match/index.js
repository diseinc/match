const matches = require('../matches');

const NoMatchingClauseError = new Error('No matching clause could be found');
const NoClausesProvidedError = new Error('No clauses provided to match against');

function evaluate(haystack, needle) {
  if (!haystack.length) {
    throw NoClausesProvidedError;
  }

  const matchesValue = matches(needle);

  const matchingClause = haystack.find(([v]) => matchesValue(v));

  if (!matchingClause) {
    throw NoMatchingClauseError;
  }

  return matchingClause[1](needle);
};

const match =
  haystack  =>
    (a, b) => b
      ? match(haystack.concat([[a, b]]))
      : evaluate(haystack, a);

module.exports = match([]);
