import { type Observable as RxObservable } from 'rxjs';
import { type Accessor, from } from 'solid-js';

export function fromObservable<T>(
  obs$: RxObservable<T>,
  initialValue: T
): Accessor<T>;
export function fromObservable<T>(
  obs$: RxObservable<T>
): Accessor<T | undefined>;
export function fromObservable<T>(
  obs$: RxObservable<T>,
  initialValue?: T
): Accessor<T | undefined> {
  return from(obs$, initialValue);
}
