import { useActor } from '@xstate/solid';
import {
  type Accessor,
  type Component,
  type ParentProps,
  createContext,
  createMemo,
} from 'solid-js';

import type { Lap } from '../../types';
import {
  type StopwatchActorRef,
  type StopwatchActorSnapshot,
  stopwatchMachine,
} from '../stopwatch.machine';
import type { StopwatchActorEvent } from '../types';

export type StopwatchContextValue = {
  actorRef: StopwatchActorRef;
  currentLap: Accessor<Lap>;
  currentSplit: Accessor<number>;
  currentTotal: Accessor<number>;
  lap: () => void;
  laps: Lap[];
  reset: () => void;
  send: (event: StopwatchActorEvent) => void;
  snapshot: StopwatchActorSnapshot;
  start: () => void;
  stop: () => void;
};

export const StopwatchContext = createContext<StopwatchContextValue>();

export const StopwatchProvider: Component<ParentProps> = (props) => {
  const [snapshot, send, actorRef] = useActor(stopwatchMachine);

  const currentSplit = () => snapshot.context.currentSplit;

  const laps = snapshot.context.laps;

  const currentTotal = createMemo(() => {
    const previousTotal = laps[0]?.total ?? 0;
    return previousTotal + currentSplit();
  });

  const currentLap = createMemo<Lap>(() => ({
    lapNumber: laps.length + 1,
    split: currentSplit(),
    total: currentTotal(),
  }));

  const lap = () => send({ type: 'lap' });
  const reset = () => send({ type: 'reset' });
  const start = () => send({ type: 'start' });
  const stop = () => send({ type: 'stop' });

  return (
    <StopwatchContext.Provider
      value={{
        actorRef,
        currentLap,
        currentSplit,
        currentTotal,
        lap,
        laps,
        reset,
        send,
        snapshot,
        start,
        stop,
      }}
    >
      {props.children}
    </StopwatchContext.Provider>
  );
};
