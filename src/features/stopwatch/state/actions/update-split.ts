import { stopwatchMachineSetup } from '../stopwatch.machine.setup';

export const updateSplit = stopwatchMachineSetup.assign(({ event }) =>
  event.type === 'update_split' ? { currentSplit: event.elapsed } : {}
);
