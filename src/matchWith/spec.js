const { expect } = require('chai');

const matchWith = require('./index');
const _ = Symbol.for('_');

describe('matchWith', () => {
  it('should be a function of length 1', () => {
    expect(matchWith).to.be.a('function');
    expect(matchWith).to.have.lengthOf(1);
  });

  it('should return a function of length 2', () => {
    const next = matchWith(_);

    expect(next).to.be.a('function');
    expect(next).to.have.lengthOf(2);
  });

  it('should return match/2 when condition is not catchall (_)', () => {
    const next = matchWith(5)
      (10, () => false);

    expect(next).to.be.a('function');
    expect(next).to.have.lengthOf(2);
  });

  it('should evaluate when clause contains catchall (_)', () => {
    const evaluatedOnCatchAll = matchWith(2)
      (10, () => false)
      (_, () => true);

    expect(evaluatedOnCatchAll).to.be.true;
  });
});
