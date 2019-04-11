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

  it('should match on regex', () => {
    const matchOn = matches('foobar');

    expect(matchOn(/foo/)).to.be.true;
    expect(matchOn(/baz/)).to.be.false;
  });

1
  it('should match on regex when matchee is an array', () => {
    const matchOnArray = matches(['foobar', 15]);

    expect(matchOnArray([/foo/, _])).to.be.true;
    expect(matchOnArray([/baz/, _])).to.be.false;
  });

  it('should match on regex when value is a number', () => {
    const matchOnNumber = matches(299);

    expect(matchOnNumber(/^2/)).to.be.true;
    expect(matchOnNumber(/300/)).to.be.false;
  });
  it('should not match on regex when value is a symbol', () => {
    const yes = Symbol.for('yes');
    const no = Symbol.for('no');
    const matchOnSymbol = matches(yes);

    expect(matchOnSymbol([/yes/, _])).to.be.false;
    expect(matchOnSymbol([/Symbol\(yes\)/, _])).to.be.false;
    expect(matchOnSymbol([/no/, _])).to.be.false;
  });

  it('should match on regex when value implements toString', () => {
    const withToString = { toString() { return 'TO_STRING'; } };
    const matchOnToString = matches(withToString);

    expect(matchOnToString(/TO_STRING/)).to.be.true;
  });

  it('should apply value when condition is a function', () => {
    let value;

    const fn = (matchAgainst) => {
      value = matchAgainst;
      return true;
    }

    matches('some value')(fn);

    expect(value).to.equal('some value');
  });

  it('should match on function, when function returns true', () => {
    const fnTrue = () => true;

    expect(matches(_)(fnTrue)).to.be.true;
  });

  it('should not match on function, when function returns false', () => {
    const fnFalse = () => false;

    expect(matches(_)(fnFalse)).to.be.false;
  });
});
