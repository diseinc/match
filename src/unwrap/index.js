module.exports = function unwrap(s) {
  if (s.unwrap) return s.unwrap();
  if (s.value)  return s.value;

  return [].concat(s);
}
