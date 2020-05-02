import { changed } from '@/util/object';

describe('util/object/changed', () => {
  it.each([
    [1, 2],
    [undefined, 1],
  ])('should be true for changed(%s, %s)', (left, right) => {
    expect(changed(left, right)).toBe(true);
  });

  it.each([
    [1, 1],
    [undefined, undefined],
    [undefined, null],
    [null, null],
    [undefined, ''],
    [null, ''],
  ])('should be false for changed(%s, %s)', (left, right) => {
    expect(changed(left, right)).toBe(true);
  });
});
