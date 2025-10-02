import { type Component, createMemo } from 'solid-js';

import { LapsTable } from './laps-table/laps-table';
import { useStopwatch } from './state';
import { StopwatchControls } from './stopwatch-controls/stopwatch-controls';
import { splitFormat } from './utils';

// TODO: add data visualizations with d3 later
// TODO: continue here...
export const Stopwatch: Component = () => {
  const { currentTotal } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  return (
    <div class="grid h-screen grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 p-8">
      <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

      <LapsTable />

      <StopwatchControls />
    </div>
  );
};
