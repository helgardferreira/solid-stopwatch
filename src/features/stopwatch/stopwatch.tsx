import { type Component, Show, createMemo } from 'solid-js';

import { cn } from '../../utils';

import { LapsHistogram } from './laps-histogram/laps-histogram';
import { LapsSparkline } from './laps-sparkline/laps-sparkline';
import { LapsTable } from './laps-table/laps-table';
import { useStopwatch } from './state';
import { StopwatchControls } from './stopwatch-controls/stopwatch-controls';
import { splitFormat } from './utils';

export const Stopwatch: Component = () => {
  const { currentTotal, laps } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  const showDataViz = () => laps.length >= 5;

  return (
    <div
      class={cn(
        'grid h-screen w-full p-3 lg:p-8',
        showDataViz() && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-[4fr_3fr]'
      )}
    >
      <div class="grid h-full w-full grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 overflow-hidden">
        <p class="font-mono text-4xl sm:text-7xl md:text-5xl lg:text-7xl">
          {formattedCurrentTotal()}
        </p>

        <LapsTable />

        <StopwatchControls />
      </div>

      <Show when={showDataViz()}>
        <div class="grid h-full w-full grid-rows-2 gap-4 overflow-x-hidden overflow-y-auto p-4">
          <LapsSparkline />

          <LapsHistogram />
        </div>
      </Show>
    </div>
  );
};
