import { stopwatchMachineSetup } from '../stopwatch.machine.setup';

export const reset = stopwatchMachineSetup.assign({
  currentSplit: 0,
  laps: [],
});
