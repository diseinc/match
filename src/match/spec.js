const { expect } = require('chai');

const match = require('./index');
const _ = Symbol.for('_');

describe('match', () => {
  it('should be a function of length 1', () => {
    expect(match).to.have.lengthOf(1);
  });

  it('should return a function of length 2', () => {
    expect(match(1)).to.have.lengthOf(2);
  });

  it('should return a value when condition is `_`', () => {
    expect(match(1)(_, () => 5)).to.equal(5);
  });

  it('should throw an error if `exec` is not a function', () => {
    const matcher = match(5);

    expect(() => matcher(_, 5)).to.throw(TypeError);
  });

  it('should return the value of the earliest matching condition', () => {
    const result = match([1, 2, 3])
      ([1, 2], () => "first match")
      (_,      () => "catchall");

    expect(result).to.equal("first match");
  });

  it('should return catchall value if nothing else matches', () => {
    const result = match([1, 2, 3])
      ( [2, 3], () => "no match" )
      ( _,      () => "catchall" );

    expect(result).to.equal("catchall");
  });

  describe('Value-Last approach', () => {
    it('should return a function of length 2 when receiving two input variables (cond, exec)', () => {
      expect(match(1, x => x)).to.have.lengthOf(2);
    });

    it('should return a function of length 2 when callback receives two input variables (cond, exec)', () => {
      const matches = match(1, x => x)
                           (2, x => x);

      expect(matches).to.have.lengthOf(2);
    });

    it('should not return a function when callback receives one input argument (term)', () => {
      const matched = match(1, x => x);
      expect(matched(1)).to.not.be.a('function');
    });

    it('should raise an error when no matching clauses are found', () => {
      const expected = /no matching clause/i;
      const matches = match(1, x => x)
                           (2, x => x)
                           (3, x => x);

      expect(() => matches(4)).to.throw(expected);
    });
  });
});
