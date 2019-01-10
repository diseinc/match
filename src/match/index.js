const matches = require('../matches');


function curry(fn) {
  return function collect(...args) {
    return args.length === fn.length
      ? fn(...args)
      : collect.bind(null, ...args)
  }
};

// lol
const curry2 = (proxy => fn => proxy(fn)(proxy))(
  _fn => _pr => (...args) =>
  args.length >= _fn.length
    ? _fn(...args)
    : _pr(_fn)(_pr).bind(null, ...args)
);

// Result
const Err = x => ({
  isErr: true,
  isOk: false,
  map: _ => Err(x),
  chain: _ => Err(x),
  fold: (f, g) => f(x),
  inspect: () => `Err(${x})`
});

const Ok = x => ({
  isErr: false,
  isOk: true,
  map: f => Ok(f(x)),
  chain: f => f(x),
  fold: (f, g) => g(x),
  inspect: () => `Ok(${x})`
});

// ---

// Option
const Some = x => ({
  isNone: false,
  isSome: true,
  map: f => Some(f(x)),
  chain: f => f(x),
  fold: (f, g) => g(x),
  inspect: () => `Some(${x})`,
  toString: () => `Some(${x})`,
});

const None = _ => ({
  isNone: true,
  isSome: false,
  map: _ => None(),
  chain: _ => None(),
  fold: (f, g) => f(None()),
  inspect: () => `None`,
  toString: () => `None`
});

const First = option => ({
  fold: f => f(option),
  concat: found =>
    option.isNone ? found : First(option),
    inspect: () => `First(${option})`
});

First.empty = () => First(None());

const foldMap = curry((list, f, empty) =>
  empty
    ? list.reduce((m, n, i) => m.concat(f(n, i)), empty)
    : list.map(f).reduce((m, n) => m.concat(n)));

const _throw = e => { throw e; };
const _return = x => x;

const find = curry((f, xs) =>
  foldMap(
    xs,
    x => f(x)
      ? First(Some(x))
      : First(None()),
    First.empty()
  )
  .fold(x => x))

const NoMatchingClauseError = new Error('No matching clause could be found');
const NoClausesProvidedError = new Error('No clauses provided to match against');

function evaluate(clauses, value) {
  const matchesClause = ([c]) => matches(value)(c);

  return Ok(clauses)
    .chain(cs => cs.length
      ? Ok(cs)
      : Err(NoClausesProvidedError)
    )
    .chain(find(matchesClause))
    .fold(e =>
      e.isNone
        ? Err(NoMatchingClauseError)
        : Err(e),
      ([_, f]) => Ok(f(value))
    );
};

const match =
  clauses  =>
    (a, b) => b
      ? match(clauses.concat([[a, b]]))
      : evaluate(clauses, a)
          .fold(_throw, _return);

module.exports = match([]);
