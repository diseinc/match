/**
 * Bare minimum implementation; or_else and match.
 * No fold, concat, and, map, etc.
 */

const Some = (x) => ({
  or_else: _ => Some(x),
  match: ({ Some: when_some }) => when_some(x)
});

const None = () => ({
  or_else: f => f(),
  match: ({ None: when_none }) => when_none(),
});

const fromNullable = x => x
  ? Some(x)
  : None();

module.exports = { Some, None, fromNullable };
