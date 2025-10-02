import { type Component, Show, createMemo, createResource } from 'solid-js';

import { LapsTable } from './laps-table/laps-table';
import { Sparkline } from './sparkline/sparkline';
import { useStopwatch } from './state';
import { StopwatchControls } from './stopwatch-controls/stopwatch-controls';
import type { WeatherDatum } from './types';
import { fetchWeatherData, splitFormat } from './utils';

// TODO: bonus interactions to sprinkle in:
//       - Tooltips (`pointer`, absolutely-positioned HTML)
//       - Transitions (`transition`, `easeQuadInOut`)
//       - Zoom/pan (`zoom`, `transform`, `rescaleX/Y`)
//       - Annotations (simple `line`/`text`, or a tiny helper function)
// TODO: implement the following data visualizations (ranked in order of difficulty low -> high):
//       - Sparkline of elapsed time (per second)
//       - Bar chart of lap durations
//       - Cumulative time area (“total so far”)
//       - Split delta bars (faster/slower than median)
//       - Pace trend line (moving average)
//       - Histogram of lap times
//       - ECDF (empirical CDF) of lap durations
//       - Waterfall chart (how each lap contributes to total)
//       - Session timeline (Active/Paused states)
//       - Brushed laps focus+context (zoom on a range)
//       - Polar “lap clock” (each lap as an arc around a circle)
//       - Box/violin plot of lap variability
//       - Voronoi/tooltip scatter: lap index vs duration
//       - Control chart (mean + ±1/2/3σ bands)
//       - KDE density curve of lap durations
//       - “Lag-1” Poincaré plot (lap n vs lap n+1)
export const Stopwatch: Component = () => {
  const { currentTotal } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  // TODO: remove this after initial data viz scaffold is complete
  const [dataset] = createResource(fetchWeatherData);

  // TODO: figure out "good enough" UI/UX for displaying charts
  //       - adjust grid template columns while implementing charts
  //       - add ability collapse / expand charts section
  return (
    // TODO: restore this after initial data viz scaffold is complete
    <div class="grid h-screen w-full grid-cols-1 gap-4 p-3 md:grid-cols-2 lg:grid-cols-[3fr_2fr] lg:p-8 xl:grid-cols-[2fr_1fr]">
      {/* // TODO: remove debug border after debugging */}
      <div class="grid h-full w-full grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 overflow-hidden rounded-md border">
        <p class="font-mono text-4xl sm:text-7xl md:text-5xl lg:text-7xl xl:text-8xl">
          {formattedCurrentTotal()}
        </p>

        <LapsTable />

        <StopwatchControls />
      </div>

      {/* // TODO: remove debug border after debugging */}
      <div class="grid h-full w-full grid-rows-2 gap-4 overflow-x-hidden overflow-y-auto rounded-md border p-4">
        <Show when={dataset() !== undefined} fallback={null}>
          <Sparkline dataset={dataset() as WeatherDatum[]} />
        </Show>
      </div>
    </div>
  );
};
