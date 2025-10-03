import { type Component, Show, createMemo } from 'solid-js';

import { LapsTable } from './laps-table/laps-table';
import { Sparkline } from './sparkline/sparkline';
import { useStopwatch } from './state';
import { StopwatchControls } from './stopwatch-controls/stopwatch-controls';
import { splitFormat } from './utils';

// TODO: implement Bar chart of lap durations
// TODO: continue here...
export const Stopwatch: Component = () => {
  const { currentTotal, laps } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  return (
    <div class="grid h-screen w-full grid-cols-1 p-3 md:grid-cols-2 lg:grid-cols-[4fr_3fr] lg:p-8">
      <div class="grid h-full w-full grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 overflow-hidden">
        <p class="font-mono text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
          {formattedCurrentTotal()}
        </p>

        <LapsTable />

        <StopwatchControls />
      </div>

      <div class="grid h-full w-full grid-rows-2 gap-4 overflow-x-hidden overflow-y-auto p-4">
        <Show when={laps.length > 2}>
          <Sparkline />
        </Show>
      </div>
    </div>
  );
};
