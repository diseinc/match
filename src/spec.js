const { expect } = require('chai');

const { ok, err, _, matches, match } = require('./index');

describe('exports', () => {
  it('should export symbol ok', () => {
    expect(ok).to.not.be.undefined;
    expect(ok).to.be.a('symbol');
  })

  it('should export symbol err', () => {
    expect(err).to.not.be.undefined;
    expect(err).to.be.a('symbol');
  });

  it('should export symbol _', () => {
    expect(_).to.not.be.undefined;
    expect(_).to.be.a('symbol');
  });

  it('should export function match', () => {
    expect(match).to.not.be.undefined;
    expect(match).to.be.a('function');
  });

  it('should export function matches', () => {
    expect(matches).to.not.be.undefined;
    expect(matches).to.be.a('function');
  });
});
