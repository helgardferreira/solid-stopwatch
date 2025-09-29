import { maxIndex, minIndex } from 'd3';
import {
  type Accessor,
  type Component,
  type ParentProps,
  batch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  useContext,
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import { StopwatchState } from './constants';
import type { Lap } from './types';

type StopwatchContextValue = {
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

const StopwatchContext = createContext<StopwatchContextValue>();

export const StopwatchProvider: Component<ParentProps> = (props) => {
  const [currentSplit, setCurrentSplit] = createSignal(0);
  const [laps, setLaps] = createStore<Lap[]>([]);
  const [state, setState] = createSignal(StopwatchState.Idle);

  const currentTotal = createMemo(() => {
    const previousTotal = laps[0]?.total ?? 0;
    return previousTotal + currentSplit();
  });

  const currentLap = createMemo<Lap>(() => ({
    lapNumber: laps.length + 1,
    split: currentSplit(),
    total: currentTotal(),
  }));

  createEffect(
    on([state, () => laps.length], ([state]) => {
      let requestId: number | undefined;
      const previousSplit = currentSplit();

      if (state === StopwatchState.Active) {
        let start: number | undefined;

        const step = (highResTimestamp: number) => {
          const timestamp = Math.floor(highResTimestamp);

          if (start === undefined) {
            start = timestamp;
          }

          const delta = timestamp - start;

          setCurrentSplit(delta + previousSplit);
          requestId = requestAnimationFrame(step);
        };

        requestId = requestAnimationFrame(step);
      }

      onCleanup(() => {
        if (requestId !== undefined) {
          cancelAnimationFrame(requestId);
          requestId = undefined;
        }
      });
    })
  );

  const addLap = () => {
    const lapNumber = laps.length + 1;
    const previousTotal = laps[0]?.total ?? 0;
    const total = previousTotal + currentSplit();

    batch(() => {
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

      setCurrentSplit(0);
    });
  };

  const reset = () => {
    batch(() => {
      setLaps([]);
      setState(StopwatchState.Idle);
      setCurrentSplit(0);
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

export const useStopwatch = (): StopwatchContextValue => {
  const context = useContext(StopwatchContext);

  if (context === undefined) {
    throw new Error('useStopwatch must be used within a StopwatchProvider');
  }

  return context;
};
