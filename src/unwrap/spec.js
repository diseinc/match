const { expect } = require('chai');

const unwrap = require('./index');

describe('unwrap', () => {
  it('should return input in an array for singular inputs', () => {
    expect(unwrap(5)).to.deep.equal([5]);
  });

  it('should return input, when input is an array', () => {
    expect(unwrap([5])).to.deep.equal([5]);
  });

  it('should return `value` if it exists', () => {
    expect(unwrap({ value: [5] })).to.deep.equal([5]);
  });

  it('should return `unwrap` if it exists', () => {
    expect(unwrap({ unwrap() { return [5]; } })).to.deep.equal([5]);
  });

  it('should return unwrap before value', () => {
    const result = {
      unwrap() { return 'UNWRAPPED'; },
      value: 'VALUE'
    };

    expect(unwrap(result)).to.equal('UNWRAPPED');
  });
});
