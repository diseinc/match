const { expect } = require('chai');

const match = require('./index');

describe('exports', () => {
  it('should export \'match\' as a property', () => {
    expect(match.match).to.not.be.undefined;
    expect(match.match).to.be.a('function');
  });

  it('should export \'matchWith\' as a property', () => {
    expect(match.matchWith).to.not.be.undefined;
    expect(match.matchWith).to.be.a('function');
  });
});
