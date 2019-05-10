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

  describe('Basic', () => {
    it('x = x', () => {
      const matchingSingle = matches(5);

      expect(matchingSingle(5)).to.be.true;
    });
    it('[x] = x', () => {
      const matching = matches(5);

      expect(matching([5])).to.be.true;
    });
  });


  describe('Array', () => {
    it('[a, b] = [a, b]', () => {
      const matchingMultiple = matches([1, 2]);

      expect(matchingMultiple([1, 2])).to.be.true;
    });

    it('[a, b] = [a, b, c]', () => {
      const matchingSubset = matches([1, 2, 3]);

      expect(matchingSubset([1, 2])).to.be.true;
    });

    it('[b, c] != [a, b, c]', () => {
      const matchingSubset = matches([1, 2, 3]);

      expect(matchingSubset([2, 3])).to.be.false;
    });

    it('[a, _] = [a, b]', () => {
      const matching = matches([1, 2]);

      expect(matching([1, _])).to.be.true;
    });
    it('[_, b] = [a, b]', () => {
      const matching = matches([1, 2]);

      expect(matching([_, 2])).to.be.true;
    });

    it('[_, _] = [a, b]', () => {
      const matching = matches([1, 2]);

      expect(matching([_, _])).to.be.true;
    });

    it('[] = []', () => {
      expect(matches([])([])).to.be.true;
    });

    it('[] != [a, b]', () => {
      expect(matches([1, 2])([])).to.be.false;
    });
  });

  describe('Regex', () => {
    const matchOn = matches('foobar');
    const matchOnArray = matches(['foobar', 15]);
    const matchOnNumber = matches(299);

    const yes = Symbol.for('yes');
    const matchOnSymbol = matches(yes);

    it('/foo/ = foo', () => {
      expect(matchOn(/foo/)).to.be.true;
    });

    it('/qux/ != foo', () => {
      expect(matchOn(/qux/)).to.be.false;
    });

    it('[/foo/, _] = [foobar, x]', () => {
      expect(matchOnArray([/foo/, _])).to.be.true;
    });

    it('[/qux/, _] = [foobar, x]', () => {
      expect(matchOnArray([/qux/, _])).to.be.false;
    });

    it('/^2/ = 299', () => {
      expect(matchOnNumber(/^2/)).to.be.true;
    });
    it('/300/ != 299', () => {
      expect(matchOnNumber(/300/)).to.be.false;
    });

    it('Symbol.for(yes) != /yes/', () => {
      expect(matchOnSymbol([/yes/, _])).to.be.false;
    });

    it('/TO_STRING/ = toString() -> TO_STRING', () => {
      const withToString = { toString() { return 'TO_STRING'; } };
      const matchOnToString = matches(withToString);

      expect(matchOnToString(/TO_STRING/)).to.be.true;
    });
  });

  describe('Function', () => {
    it('should apply value when condition is a function', () => {
      let value;

      const fn = (matchAgainst) => {
        value = matchAgainst;
        return true;
      }

      matches('some value')(fn);

      expect(value).to.equal('some value');
    });

    it('x -> true = x', () => {
      const fnTrue = () => true;

      expect(matches(1)(fnTrue)).to.be.true;
    });

    it('x -> false != x', () => {
      const fnFalse = () => false;

      expect(matches(1)(fnFalse)).to.be.false;
    });

    it('(x -> x > 3) = 5', () => {
      const fn = x => x > 3;

      expect(matches(5)(fn)).to.be.true;
    });
  });

  describe('Object', () => {
    it('{ a: 1 } = { a: 1, b: 2 }', () => {
      const matched = matches({ a: 1, b: 2 })({ a: 1 });

      expect(matched).to.be.true;
    });

    it('{ a: 1, b: 2 } = { a: 1, b: 2 }', () => {
      const matched = matches({ a: 1, b: 2 })({ a: 1, b: 2 });

      expect(matched).to.be.true;
    });

    it('{ a: 1, b: 2 } != { a: 1 }', () => {
      const matched = matches({ a: 1 })({ a: 1, b: 2 });

      expect(matched).to.be.false;
    });

    it('{ a: 1 } != { b: 1 }', () => {
      const matched = matches({ b: 1 })({ a: 1 });

      expect(matched).to.be.false;
    });

    it('{ a: 1 } != { a: 2 }', () => {
      const matched = matches({ a: 2 })({ a: 1 });

      expect(matched).to.be.false;
    });
  });
});
