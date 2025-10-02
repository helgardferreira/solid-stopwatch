import { type Component, createMemo } from 'solid-js';

import { LapsTable } from './laps-table/laps-table';
import { useStopwatch } from './state';
import { StopwatchControls } from './stopwatch-controls/stopwatch-controls';
import { splitFormat } from './utils';

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
// TODO: continue here...
export const Stopwatch: Component = () => {
  const { currentTotal } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  // TODO: remove this after debugging
  /*
  return (
    <div class="grid h-screen grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 p-8">
      <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

      <LapsTable />

      <StopwatchControls />
    </div>
  );
  */

  // TODO: figure out "good enough" UI/UX for displaying charts
  //       - adjust grid template columns while implementing charts (especially if responsive charts is too complex)
  //       - add ability collapse / expand charts section
  return (
    <div class="grid h-screen w-full grid-cols-1 gap-4 p-3 md:grid-cols-2 lg:grid-cols-[3fr_2fr] lg:p-8 xl:grid-cols-[2fr_1fr]">
      {/* // TODO: restore this after debugging */}
      {/* <div class="grid h-full w-full grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 overflow-hidden"> */}
      <div class="grid h-full w-full grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 overflow-hidden rounded-md border">
        <p class="font-mono text-4xl sm:text-7xl md:text-5xl lg:text-7xl xl:text-8xl">
          {formattedCurrentTotal()}
        </p>

        <LapsTable />

        <StopwatchControls />
      </div>

      {/* // TODO: restore this after debugging */}
      {/* <div class="h-full w-full"> */}
      <div class="h-full w-full rounded-md border">
        <Sparkline />
      </div>
    </div>
  );
};

// TODO: move this
//// ---------------------------------------------------------------------------
// TODO: implement this
// TODO: continue here...
export const Sparkline: Component = () => {
  /*
   * Chart drawing checklist:
   *
   * Access data
   * Create chart dimensions
   * Draw canvas
   * Create scales
   * Draw data
   * Draw peripherals
   * Set up interactions
   */

  return <div>Coming soon...</div>;
};
//// ---------------------------------------------------------------------------
