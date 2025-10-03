import type { DeepAccessor } from '../../types';
import { accessDeep } from '../signals/access-deep';

describe('accessDeep', () => {
  type MockOptions = {
    a: number;
    b: boolean;
    c?: { c1: string };
    d?: { d1: number }[];
    e: Date;
    f?: number[];
  };

  it('can access simple objects', () => {
    const options: DeepAccessor<MockOptions> = {
      a: 10,
      b: true,
      e: new Date(0, 0, 0, 0, 0, 0, 0),
    };

    const expected = {
      a: 10,
      b: true,
      e: new Date(0, 0, 0, 0, 0, 0, 0),
    };

    const result = accessDeep(options);

    expect(result).toStrictEqual(expected);
  });

  it('can access simple objects with accessors', () => {
    const options: DeepAccessor<MockOptions> = {
      a: () => 10,
      b: () => true,
      e: () => new Date(0, 0, 0, 0, 0, 0, 0),
    };

    const expected = {
      a: 10,
      b: true,
      e: new Date(0, 0, 0, 0, 0, 0, 0),
    };

    const result = accessDeep(options);

    expect(result).toStrictEqual(expected);
  });

  it('can access complex objects with nested accessors', () => {
    const options: DeepAccessor<MockOptions> = {
      a: () => 10,
      b: () => true,
      c: { c1: () => 'test' },
      d: () => [{ d1: 100 }],
      e: () => new Date(0, 0, 0, 0, 0, 0, 0),
      f: [() => 1, 2, () => 3],
    };

    const expected = {
      a: 10,
      b: true,
      c: { c1: 'test' },
      d: [{ d1: 100 }],
      e: new Date(0, 0, 0, 0, 0, 0, 0),
      f: [1, 2, 3],
    };

    const result = accessDeep(options);

    expect(result).toStrictEqual(expected);
  });

  it('ignores prototypal properties', () => {
    const optionsParent = { a: () => 1 };
    const options = { b: () => 2, c: () => 3 };

    Object.setPrototypeOf(options, optionsParent);

    const expected = { b: 2, c: 3 };

    const result = accessDeep(options);

    expect(result).toStrictEqual(expected);
  });
});
