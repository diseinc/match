const { expect } = require('chai');

const match = require('./index');

describe('exports', () => {
  it('should export a function (match)', () => {
    expect(match).to.not.be.undefined;
    expect(match).to.be.a('function');
  });

  it('should export \'match\' as a property as well', () => {
    expect(match.match).to.not.be.undefined;
    expect(match.match).to.be.a('function');
  });

  it('should export \'matchWith\' as a property', () => {
    expect(match.matchWith).to.not.be.undefined;
    expect(match.matchWith).to.be.a('function');
  });
});
