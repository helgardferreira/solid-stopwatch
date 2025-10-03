/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AccessDeep, DeepAccessor } from '../../types';

// TODO: document this
export function accessDeep<T, U extends DeepAccessor<T>>(
  deepAccessor: U
): AccessDeep<U> {
  if (
    typeof deepAccessor !== 'object' ||
    deepAccessor instanceof Date ||
    deepAccessor instanceof File ||
    deepAccessor instanceof FileList
  ) {
    return deepAccessor as unknown as AccessDeep<U>;
  }

  let accessedRecord: any;

  if (Array.isArray(deepAccessor)) {
    accessedRecord = [];
  } else {
    accessedRecord = {};
  }

  for (const key in deepAccessor) {
    if (!Object.hasOwn(deepAccessor, key)) continue;

    const property = deepAccessor[key];

    let accessedProperty;

    if (typeof property === 'function' && property.length === 0) {
      accessedProperty = property();
    } else {
      accessedProperty = property;
    }

    accessedRecord[key] = accessDeep(accessedProperty as any);
  }

  return accessedRecord as unknown as AccessDeep<U>;
}
