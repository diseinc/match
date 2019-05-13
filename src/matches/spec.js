const { expect } = require('chai');

const matches = require('./index');
const _ = Symbol.for('_');

describe('matches', () => {
  it('should be a function', () => {
    expect(matches).to.be.a('function');
  });

  it('should return a function', () => {
    const matchTerm = matches(true);
    expect(matchTerm).to.be.a('function');;
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

    it('[x] != x', () => {
      const matching = matches(5);

      expect(matching([5])).to.be.false;
    });

    it('x != [x]', () => {
      const matching = matches([5]);

      expect(matching(5)).to.be.false;
    });
  });


  describe('Array', () => {
    it('[a, b] = [a, b]', () => {
      const matchingMultiple = matches([1, 2]);

      expect(matchingMultiple([1, 2])).to.be.true;
    });

    it('[a, b] != [a, b, c]', () => {
      const matchingSubset = matches([1, 2]);

      expect(matchingSubset([1, 2, 3])).to.be.false;
    });

    it('[b, c] != [a, b, c]', () => {
      const matchingSubset = matches([2, 3]);

      expect(matchingSubset([1, 2, 3])).to.be.false;
    });

    it('[a, b] = [a, _]', () => {
      const matching = matches([1, 2]);

      expect(matching([1, _])).to.be.true;
    });
    it('[a, b] = [_, b]', () => {
      const matching = matches([1, 2]);

      expect(matching([_, 2])).to.be.true;
    });

    it('[a, b] = [_, _]', () => {
      const matching = matches([1, 2]);

      expect(matching([_, _])).to.be.true;
    });

    it('[] = []', () => {
      expect(matches([], [])).to.be.true;
    });

    it('[a, b] != []', () => {
      expect(matches([1, 2], [])).to.be.false;
    });
  });

  describe('Regex', () => {
    const matchOn = matches('foobar');
    const matchOnArray = matches(['foobar', 15]);
    const matchOnNumber = matches(299);

    const yes = Symbol.for('yes');
    const matchOnSymbol = matches(yes);

    it('foobar = /foo/', () => {
      expect(matchOn(/foo/)).to.be.true;
    });

    it('foobar != /qux/', () => {
      expect(matchOn(/qux/)).to.be.false;
    });

    it('[foobar, x] = [/foo/, _]', () => {
      expect(matchOnArray([/foo/, _])).to.be.true;
    });

    it('[foobar, x] = [/qux/, _]', () => {
      expect(matchOnArray([/qux/, _])).to.be.false;
    });

    it('299 = /^2/', () => {
      expect(matchOnNumber(/^2/)).to.be.true;
    });
    it('299 != /300/', () => {
      expect(matchOnNumber(/300/)).to.be.false;
    });

    it('toString() -> TO_STRING = /TO_STRING/', () => {
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

      matches('some value', fn);

      expect(value).to.equal('some value');
    });

    it('x = (x -> true)', () => {
      const fnTrue = () => true;

      expect(matches(1, fnTrue)).to.be.true;
    });

    it('x != (x -> false)', () => {
      const fnFalse = () => false;

      expect(matches(1, fnFalse)).to.be.false;
    });

    it('(x -> x > 3) = 5', () => {
      const fn = x => x > 3;

      expect(matches(5, fn)).to.be.true;
    });
  });

  describe('Object', () => {
    it('{ a: 1 } = { a: 1, b: 2 }', () => {
      const matched = matches({ a: 1, b: 2 }, { a: 1 });

      expect(matched).to.be.true;
    });

    it('{ a: 1, b: 2 } = { a: 1, b: 2 }', () => {
      const matched = matches({ a: 1, b: 2 }, { a: 1, b: 2 });

      expect(matched).to.be.true;
    });

    it('{ a: 1, b: 2 } != { a: 1 }', () => {
      const matched = matches({ a: 1 }, { a: 1, b: 2 });

      expect(matched).to.be.false;
    });

    it('{ a: 1 } != { b: 1 }', () => {
      const matched = matches({ b: 1 }, { a: 1 });

      expect(matched).to.be.false;
    });

    it('{ a: 1 } != { a: 2 }', () => {
      const matched = matches({ a: 2 }, { a: 1 });

      expect(matched).to.be.false;
    });
  });
});
