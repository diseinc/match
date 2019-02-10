const { expect } = require('chai');

const match = require('./index');

describe('exports', () => {
  it('should export a function (match)', () => {
    expect(match).to.not.be.undefined;
    expect(match).to.be.a('function');
  });
});
