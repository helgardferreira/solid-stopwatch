import {
  EMPTY,
  type Observable,
  from as fromSolid,
  map,
  switchMap,
  tap,
} from 'rxjs';
import {
  type Accessor,
  type Setter,
  createSignal,
  from as fromRx,
  observable,
} from 'solid-js';

import { fromResize } from './observables';

type UseContentResizeResultOptions = {
  onResize?: ResizeObserverCallback;
  onChange?: (contentRect: DOMRectReadOnly, observer: ResizeObserver) => void;
};

type UseContentResizeResult<T extends Element> = [
  setRef: Setter<T | undefined>,
  contentRect: Accessor<DOMRectReadOnly | undefined>,
  contentRect$: Observable<DOMRectReadOnly>,
];

// TODO: document this
export const useContentResize = <T extends Element>(
  options: UseContentResizeResultOptions = {}
): UseContentResizeResult<T> => {
  const [ref, setRef] = createSignal<T>();

  const contentRect$ = fromSolid(observable(ref)).pipe(
    switchMap((element) =>
      element !== undefined ? fromResize(element) : EMPTY
    ),
    tap(({ entries, observer }) => {
      options.onResize?.(entries, observer);
      options.onChange?.(entries[0].contentRect, observer);
    }),
    map(({ entries }) => entries[0].contentRect)
  );

  const contentRect = fromRx(contentRect$);

  return [setRef, contentRect, contentRect$];
};
