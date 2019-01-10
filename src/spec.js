const { expect } = require('chai');

const { _, matches, match } = require('./index');

describe('exports', () => {
  it('should export function match', () => {
    expect(match).to.not.be.undefined;
    expect(match).to.be.a('function');
  });

  it('should export function matches', () => {
    expect(matches).to.not.be.undefined;
    expect(matches).to.be.a('function');
  });
});
