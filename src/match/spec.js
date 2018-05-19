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
});
