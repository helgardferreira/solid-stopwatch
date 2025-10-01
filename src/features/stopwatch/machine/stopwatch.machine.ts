import {
  type CallbackLogicFunction,
  assign,
  fromCallback,
  setup,
} from 'xstate';

import type { Lap } from '../types';

type StopwatchMachineContext = {
  currentSplit: number;
  laps: Lap[];

  // TODO: determine whether to implement derived `currentLap` and `currentTotal` inside, or outside, of state machine
  // currentLap: Lap;
  // currentTotal: number;
};

type LapEvent = { type: 'lap' };
type ResetEvent = { type: 'reset' };
type StartEvent = { type: 'start' };
type StopEvent = { type: 'stop' };
type UpdateSplitEvent = { type: 'update_split'; elapsed: number };

type StopwatchMachineEvent =
  | LapEvent
  | ResetEvent
  | StartEvent
  | StopEvent
  | UpdateSplitEvent;

// TODO: move this
//// ---------------------------------------------------------------------------
// TODO: implement this
// TODO: continue here...
export const currentSplitActorLogic: CallbackLogicFunction<
  StopwatchMachineEvent,
  StopwatchMachineEvent
> = ({ sendBack }) => {
  // TODO: remove this after debugging
  console.log('invoking current split actor');

  // TODO: remove this reference code after implementation
  /*
    let requestId: number | undefined;
    const previousSplit = currentSplit();

    if (state === StopwatchState.Active) {
      let start: number | undefined;

      const step = (highResTimestamp: number) => {
        const timestamp = Math.floor(highResTimestamp);

        if (start === undefined) {
          start = timestamp;
        }

        const elapsed = timestamp - start;

        setCurrentSplit(elapsed + previousSplit);
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
    */

  let requestId: number | undefined;

  // TODO: figure out idiomatic approach to handling "lap" logic
  // TODO: figure out idiomatic approach to handling "resume" logic
  // TODO: implement this
  // const previousSplit = ...

  let start: number | undefined;

  const step = (highResTimestamp: number) => {
    const timestamp = Math.floor(highResTimestamp);

    if (start === undefined) {
      start = timestamp;
    }

    const elapsed = timestamp - start;

    // TODO: figure out idiomatic way to implement this
    // sendBack({ type: 'update_split', elapsed: elapsed + previousSplit });
    sendBack({ type: 'update_split', elapsed });
    requestId = requestAnimationFrame(step);
  };

  requestId = requestAnimationFrame(step);

  return () => {
    // TODO: remove this after debugging
    console.log('cleaning up current split actor');

    if (requestId !== undefined) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  };
};

// TODO: determine if input, self, and system are necessary for implementation
export const currentSplitActor = fromCallback(currentSplitActorLogic);
//// ---------------------------------------------------------------------------

// TODO: refactor with new XState modular API
//       - try out new `setup`-bound createStateConfig
//       - try out new `setup`-bound createAction
//       - try out new `setup`-bound built-in actions; including:
//         - `spawnChild`
//         - `stopChild`
//         - etc.
// TODO: replace current `solid-js`-only state implementation with state machine
// TODO: implement this
// TODO: continue here...
export const stopwatchMachine = setup({
  types: {
    context: {} as StopwatchMachineContext,
    events: {} as StopwatchMachineEvent,
  },
  // TODO: refactor this
  actions: {
    // TODO: implement this
    updateSplit: assign({
      currentSplit: (_, { elapsed }: { elapsed: number }) => elapsed,
    }),
  },
  actors: {
    currentSplitActor,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsAOB3AhigxgBYB0AkhADZgDEqOATigNoAMAuoqBmrAJYq80AO04gAHogDMAVmnEAHABYA7ADYAjNJYAmFvICc67QBoQATynbtxdYqWTFkjdvkyAvm9OpMuAiQCC+AIAbjTeGKwcSCDcfALCohIIMvI20vLy6pnKGfqqytKmFgiZxJJWhnnS+SzqqooeXujYeETEAMrNGJC0KAzM7KKx-IIi0UnqytaykpLyqpKa6vrZRYi66sTKMvnKLHr6+trpjSDhvm2dmN0Q1PRwYANRXDwjCeOIk9PSs-OL0stVuZLNZbPZHM5XNIPJ4QEI0BA4KJzq1CENXvExqAkgBaVRrBB404ovxkShgdFxUaJdZTGwZZSHDTKRR2FjKAnlayLerqIzSRS1FgLYnNC4BIK8UKUt5Y8SIRTSayZSQFPKKZYCxUErIsYgrAzaBaaTKChqwkmXLqQGWYmkIRQmYElfQKBbaZSMxaOZbaGFuIA */
  id: 'stopwatch',
  context: {
    currentSplit: 0,
    laps: [],
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        start: 'Active',
      },
    },
    // TODO: implement currentSplit actor
    Active: {
      on: {
        stop: 'Stopped',
        update_split: {
          actions: {
            params: ({ event }) => ({ elapsed: event.elapsed }),
            type: 'updateSplit',
          },
        },
      },

      invoke: {
        src: 'currentSplitActor',
        id: 'currentSplit',
      },
    },
    Stopped: {
      on: {
        start: 'Active',
        reset: {
          // TODO: update this after implementing reset action
          // actions
          target: 'Idle',
        },
      },
    },
  },
});
