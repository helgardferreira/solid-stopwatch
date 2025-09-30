import { type Observable as RxObservable, from } from 'rxjs';
import { type Accessor, observable } from 'solid-js';

export const fromSignal = <T>(signal: Accessor<T>): RxObservable<T> =>
  from(observable(signal));
