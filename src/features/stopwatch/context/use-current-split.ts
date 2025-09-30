import {
  animationFrames,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  skip,
  switchScan,
  withLatestFrom,
} from 'rxjs';
import { type Accessor } from 'solid-js';

import { fromObservable, fromSignal } from '../../../utils';
import { StopwatchState } from '../constants';
import type { Lap } from '../types';

type UseCurrentSplitOptions = {
  laps: Lap[];
  state: Accessor<StopwatchState>;
};

export const useCurrentSplit = ({
  laps,
  state,
}: UseCurrentSplitOptions): Accessor<number> => {
  const state$ = fromSignal(state);
  const laps$ = fromSignal<Lap[]>(() => laps.map((lap) => ({ ...lap })));

  const stateEvent$ = state$.pipe(
    distinctUntilChanged(),
    map((state) => ({ type: 'state', state }) as const)
  );

  const lapEvent$ = laps$.pipe(
    skip(1),
    withLatestFrom(state$),
    filter(([, s]) => s === StopwatchState.Active),
    map(() => ({ type: 'lap' as const }))
  );

  const stopwatchEvent$ = merge(stateEvent$, lapEvent$);

  return fromObservable(
    stopwatchEvent$.pipe(
      switchScan(
        (split, event) =>
          event.type === 'state'
            ? event.state === StopwatchState.Active
              ? animationFrames().pipe(
                  map(({ elapsed }) => split + Math.floor(elapsed))
                )
              : event.state === StopwatchState.Stopped
                ? of(split)
                : of(0)
            : animationFrames().pipe(map(({ elapsed }) => Math.floor(elapsed))),
        0
      )
    ),
    0
  );
};
