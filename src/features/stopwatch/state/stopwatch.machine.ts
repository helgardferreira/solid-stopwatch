import type { ActorRefFrom, SnapshotFrom } from 'xstate';

import { addLap, reset, updateSplit } from './actions';
import { stopwatchMachineSetup } from './stopwatch.machine.setup';

export enum StopwatchState {
  Active = 'Active',
  Idle = 'Idle',
  Stopped = 'Stopped',
}

export const stopwatchMachine = stopwatchMachineSetup.createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwC4HsAOB3AhigxgBYB0AgvigJYBuYAxADY4YDaADALqKgZqyVU0AO24gAHogCsAdgCMxACwBmAGwAOJdOkAmFdICcagDQgAnom2yFxJbP0rJK7W0lt9hgL4eTqTLgIk5FS0dL6snKK8-IIiSOKISpL6ikoKavra0hoqsgYm5ghq8kra2ulsmYmyzkpePujYeERkFDT0AK4YEHhgAPqwGAwC7FxxUQKUwqISCJKS8tXKmjIZagrS+YiydsRsCmlqriUqqZp1IGH+zQCSEAz0qDgATigjkXwTU3EzidLE1ZpZJIFEC2LlJJsEKVrAoVGwlGw3GwivDVOdLk0SABlBoYSB0J5wMCvCJjD4xaZbJzEOZKJRrZHSBQySHOeTSRIODL0jkqdENK7Y3H4x4vN5k6KTWKgGayam0+kKRnMjZmBL7YhqDlg-RaFQ5MFebwgIRoCBwUQYgLvSVfGWIAC0KkhTt2iPdHvdVn5fkxLWCYBtn2l8QQsOsyMMCPSev0cshtmsSWUHIUmW0wIzPsaAWIt3uQYp3wsHMUKjS6jUezSclZ2msTjUGYqJTcVdqxqtzRxmDxEELUspYe0de0-zKze0rcM8KNHiAA */
  id: 'stopwatch',
  context: {
    currentSplit: 0,
    laps: [],
  },
  initial: 'Idle',
  states: {
    [StopwatchState.Active]: {
      invoke: {
        id: 'currentSplit',
        input: ({ context }) => ({ previousSplit: context.currentSplit }),
        src: 'currentSplitLogic',
      },

      on: {
        lap: {
          actions: addLap,
          reenter: true,
          target: 'Active',
        },
        stop: 'Stopped',
        update_split: { actions: updateSplit },
      },
    },
    [StopwatchState.Idle]: {
      on: { start: 'Active' },
    },
    [StopwatchState.Stopped]: {
      on: {
        reset: { actions: reset, target: 'Idle' },
        start: 'Active',
      },
    },
  },
});

export type StopwatchActorRef = ActorRefFrom<typeof stopwatchMachine>;
export type StopwatchActorSnapshot = SnapshotFrom<typeof stopwatchMachine>;
