import { maxIndex, minIndex } from 'd3';
import { type ActorRefFrom, type SnapshotFrom, assign, setup } from 'xstate';

import type { Lap } from '../types';

import { currentSplitLogic } from './actors';
import type { StopwatchActorContext, StopwatchActorEvent } from './types';

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
    context: {} as StopwatchActorContext,
    events: {} as StopwatchActorEvent,
  },
  // TODO: refactor this
  actions: {
    addLap: assign(
      (_, { currentSplit, laps }: { currentSplit: number; laps: Lap[] }) => {
        const lapNumber = laps.length + 1;
        const previousTotal = laps[0]?.total ?? 0;
        const total = previousTotal + currentSplit;

        let newLaps: Lap[] = [
          {
            isFastest: false,
            isSlowest: false,
            lapNumber,
            split: currentSplit,
            total,
          },
          ...laps,
        ];

        if (newLaps.length >= 2) {
          const fastestIdx = minIndex(newLaps, (d) => d.split);
          const slowestIdx = maxIndex(newLaps, (d) => d.split);

          newLaps = newLaps.map((lap, idx) => {
            return {
              ...lap,
              isFastest: idx === fastestIdx,
              isSlowest: idx === slowestIdx,
            };
          });
        }

        return {
          currentSplit: 0,
          laps: newLaps,
        };
      }
    ),
    reset: assign({ currentSplit: 0, laps: [] }),
    updateSplit: assign((_, { elapsed }: { elapsed: number }) => ({
      currentSplit: elapsed,
    })),
  },
  actors: {
    currentSplitLogic,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsAOB3AhigxgBYB0AkhADZgDEqOATigNoAMAuoqBmrAJYq80AO04gAHogDMAFgCsxABzSA7ADYATJIUBOBZICMC1QBoQAT0TqW+4ssmzVC2ev0tJ22Qv0Bfb6dSYuAQkAIL4AgBuNAEYrBxIINx8AsKiEggyCsT6ngrqyuq6qqoqphYIXsSS6oX62qo5yvoFyr7+6Nh4RMRhkTQArhgQeGAA+rAYFPxxokn8giIJ6bLutrLKLMpO9YVNZYh1NrIeLHn6Bu4N0m0gMUHdvbxR1BQ4seyzPPOpS4gOqmt1hp9NISuodPsEPUqlZ7CwPKp3E1VDc7l0SABlDoYSC0FAMZgfBJzFKLUDpfQaYiyFaSOwKIzSbRqSHVdTZaRKWSnFjc5TSa5+W4de6Y7G4+hwMCE+JcL6ktIHKk0yR0rSM5kmcyWay2eyOZyudyeHw3IRoCBwURo4KfZILRUIAC0WvKLtRIvRZEoYDt3zJ4ksVMMCi2alqan0kKsNm0blUdma9n06kF7UCXseUT9Ct+CDk7K8dNUNI0Ojysmj2hsRl050kLERHhBHozwWIWMwOIgOYdeek6khdW0xGk8cTdlkKcFviAA */
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
    Active: {
      invoke: {
        id: 'currentSplit',
        input: ({ context }) => ({ previousSplit: context.currentSplit }),
        src: 'currentSplitLogic',
      },

      on: {
        stop: 'Stopped',
        update_split: {
          actions: {
            params: ({ event }) => ({ elapsed: event.elapsed }),
            type: 'updateSplit',
          },
        },
        lap: {
          actions: {
            params: ({ context }) => ({
              currentSplit: context.currentSplit,
              laps: context.laps,
            }),
            type: 'addLap',
          },
          reenter: true,
          target: 'Active',
        },
      },
    },
    Stopped: {
      on: {
        start: 'Active',
        reset: {
          actions: 'reset',
          target: 'Idle',
        },
      },
    },
  },
});

export type StopwatchActorRef = ActorRefFrom<typeof stopwatchMachine>;
export type StopwatchActorSnapshot = SnapshotFrom<typeof stopwatchMachine>;
