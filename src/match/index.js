const _ = Symbol.for('_');
const matches = require('../matches');

const NoMatchingClauseError = new Error('No matching clause could be found');
const NoClausesProvidedError = new Error('No clauses provided to match against');

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
    throw NoClausesProvidedError;
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
