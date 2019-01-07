const _ = Symbol.for('_');
const matches = require('../matches');

const NoMatchingClauseError = new Error('No matching clause could be found');

function valueFirstMatch(term) {
  const comparator = matches(term);
  let fn = null;

  return function clause(cond, exec) {
    if (typeof exec !== 'function') {
      throw new TypeError(`Expected a function, got ${typeof exec} instead`);
    }

    /**
     * If no function has been cached, and the condition matches,
     * cache the associated function.
     *
     * Since we break on _, and _ always matches, we will always have a match.
     */
    if (fn === null && comparator(cond)) {
      fn = exec;
    }

    /**
     * When `cond` is _, stop receiving conditions and
     * execute the matching function.
     */
    if (cond === _) {
      return fn.call(this, term);
    }

    return clause;
  }
};

function evaluate(clauses, value) {
  const matchingClause = clauses.find(clause => {
    const [cond, exec] = clause;

    return matches(value)(cond);
  });

  if (!matchingClause) {
    throw NoMatchingClauseError;
  }

  return matchingClause[1](value);
};

module.exports = function match(legacyCond, legacyExec) {
  const clauses = [];


  if (!legacyExec) {
    // We are in value-first mode. Aaaaaaah.
    // 'legacyCond' is now 'term', or value. Defer to legacy function.
    return valueFirstMatch(legacyCond);
  }
  else {
    // Since we can't recurse like we want't, the first is to push
    // the clause onto the stack.
    clauses.push([legacyCond, legacyExec]);
  }

  return function clause(cond, exec) {
    if (!exec) {
      // Here, exec = false means that it's time to evaluate.
      // 'cond' is the submitted value;
      return evaluate(clauses, cond);
    }

    clauses.push([cond, exec]);

    return clause;
  }
};
