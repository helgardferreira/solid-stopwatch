/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Accessor } from 'solid-js';

import type { BrowserNativeObject, Primitive } from '../common';

type Access<T> = T extends Accessor<infer U> ? U : never;

type AccessDeep<T> = T extends any
  ? {
      [K in keyof T]: T[K] extends infer U
        ? U extends Primitive | BrowserNativeObject
          ? U
          : U extends Accessor<infer V>
            ? V
            : AccessDeep<U>
        : never;
    }
  : never;

type DeepAccessor<T> = T extends any
  ? {
      [K in keyof T]: T[K] extends Primitive | BrowserNativeObject
        ? T[K] | Accessor<T[K]>
        : DeepAccessor<T[K]> | Accessor<T[K]>;
    }
  : never;

export type { Access, AccessDeep, DeepAccessor };
