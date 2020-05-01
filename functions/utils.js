function setDiff(left, right) {
  left = left || [];
  right = right || [];
  return {
    removed: left.filter((l) => !right.includes(l)),
    added: right.filter((r) => !left.includes(r)),
  };
}

module.exports = {
  setDiff,
};
