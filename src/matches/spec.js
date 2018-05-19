const { expect } = require('chai');

const matches = require('./index');
const _ = Symbol.for('_');

describe('matches', () => {
  it('should be a function of length 1', () => {
    expect(matches).to.have.property('length');
    expect(matches).to.have.lengthOf(1);
  });

  it('should return a function of length 1', () => {
    const matchTerm = matches(true);
    expect(matchTerm).to.have.property('length');
    expect(matchTerm).to.have.lengthOf(1);
  });

  it('should never match when the second condition is longer than the first', () => {
    const matchTerm = matches(true);

    expect(matchTerm([true, true])).to.be.false;
    expect(matchTerm([_, _])).to.be.false;
  });

  it('should match on full equality', () => {
    const matchingSingle = matches(5);
    const matchingMultiple = matches([1, 2, 3]);

    expect(matchingSingle(5)).to.be.true;
    expect(matchingMultiple([1, 2, 3])).to.be.true;
  });

  it('should match on partial left-to-right matches', () => {
    const matchingSubset = matches([1, 2, 3]);

    expect(matchingSubset([1, 2])).to.be.true;
    expect(matchingSubset([2, 3])).to.be.false;
  });

  it('should always match on _', () => {
    const matchingMultiple = matches([1, 2]);

    expect(matchingMultiple([1, 2])).to.be.true;
    expect(matchingMultiple([1, _])).to.be.true;
    expect(matchingMultiple([_, 2])).to.be.true;
    expect(matchingMultiple([_, _])).to.be.true;
  });
});
