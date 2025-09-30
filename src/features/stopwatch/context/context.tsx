import { maxIndex, minIndex } from 'd3';
import {
  type Accessor,
  type Component,
  type ParentProps,
  batch,
  createContext,
  createMemo,
  createSignal,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { StopwatchState } from '../constants';
import type { Lap } from '../types';

import { useCurrentSplit } from './use-current-split';

export type StopwatchContextValue = {
  addLap: () => void;
  currentLap: Accessor<Lap>;
  currentSplit: Accessor<number>;
  currentTotal: Accessor<number>;
  laps: Lap[];
  reset: () => void;
  start: () => void;
  state: Accessor<StopwatchState>;
  stop: () => void;
};

export const StopwatchContext = createContext<StopwatchContextValue>();

export const StopwatchProvider: Component<ParentProps> = (props) => {
  const [laps, setLaps] = createStore<Lap[]>([]);
  const [state, setState] = createSignal(StopwatchState.Idle);
  const currentSplit = useCurrentSplit({ state, laps });

  const currentTotal = createMemo(() => {
    const previousTotal = laps[0]?.total ?? 0;
    return previousTotal + currentSplit();
  });

  const currentLap = createMemo<Lap>(() => ({
    lapNumber: laps.length + 1,
    split: currentSplit(),
    total: currentTotal(),
  }));

  const addLap = () => {
    const lapNumber = laps.length + 1;
    const previousTotal = laps[0]?.total ?? 0;
    const total = previousTotal + currentSplit();

    setLaps(
      produce((laps) => {
        laps.unshift({
          isFastest: false,
          isSlowest: false,
          lapNumber,
          split: currentSplit(),
          total,
        });

        if (laps.length >= 2) {
          const fastestIdx = minIndex(laps, (d) => d.split);
          const slowestIdx = maxIndex(laps, (d) => d.split);

          laps.forEach((lap, idx) => {
            lap.isFastest = idx === fastestIdx;
            lap.isSlowest = idx === slowestIdx;
          });
        }
      })
    );
  };

  const reset = () => {
    batch(() => {
      setLaps([]);
      setState(StopwatchState.Idle);
    });
  };

  const start = () => setState(StopwatchState.Active);

  const stop = () => setState(StopwatchState.Stopped);

  return (
    <StopwatchContext.Provider
      value={{
        addLap,
        currentLap,
        currentSplit,
        currentTotal,
        laps,
        reset,
        start,
        state,
        stop,
      }}
    >
      {props.children}
    </StopwatchContext.Provider>
  );
};
