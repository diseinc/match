const matches = require('../matches');

const NoMatchingClauseError = new Error('No matching clause could be found');
const NoClausesProvidedError = new Error('No clauses provided to match against');

const Right = x => ({
  map: f => Right(f(x)),
  chain: f => f(x),
  fold: (f, g) => g(x)
});

const Left = x => ({
  map: () => Left(x),
  chain: () => Left(x),
  fold: (f, g) => f(x)
});

const _throw = e => { throw e; };
const _return = x => x;

const matchesClause = needle => ([v, f]) => matches(needle)(v);
const applyClause = v => ([_, f]) => f(v);

const findClause = f => l =>
  Right(l.find(f))
    .chain(c => c
      ? Right(c)
      : Left(NoMatchingClauseError));

function evaluate(haystack, needle) {
  return Right(haystack)
    .chain(hs => hs.length
      ? Right(hs)
      : Left(NoClausesProvidedError))
    .chain(findClause(matchesClause(needle)))
    .map(applyClause(needle))
    .fold(_throw, _return);
};


const match =
  haystack  =>
    (a, b) => b
      ? match(haystack.concat([[a, b]]))
      : evaluate(haystack, a);


module.exports = match([]);
