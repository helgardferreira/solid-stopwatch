import {
  type Component,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';

import { Button } from '../../components';
import { useChartDimensions } from '../../utils';

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
export const Stopwatch: Component = () => {
  const { currentTotal } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  // TODO: remove this after debugging potential memory leaks
  // ---------------------------------------------------------------------------
  const [showSparkline, setShowSparkline] = createSignal(true);

  const sparklineToggleText = () =>
    showSparkline() ? 'Hide Sparkline' : 'Show Sparkline';

  const toggleSparkline = () => {
    setShowSparkline((showSparkline) => !showSparkline);
  };
  // ---------------------------------------------------------------------------

  // TODO: figure out "good enough" UI/UX for displaying charts
  //       - adjust grid template columns while implementing charts (especially if responsive charts is too complex)
  //       - add ability collapse / expand charts section
  return (
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
      <div class="grid h-full w-full grid-rows-2 overflow-x-hidden overflow-y-auto rounded-md border p-4">
        {/* // TODO: remove this after debugging potential memory leaks */}
        <Button class="w-fit" onClick={toggleSparkline}>
          {sparklineToggleText()}
        </Button>

        <Show when={showSparkline()} fallback={null}>
          <Sparkline />
        </Show>
      </div>
    </div>
  );
};

// TODO: move this
//// ---------------------------------------------------------------------------
// TODO: refactor this out into separate components and utilities (e.g. axis, canvas, get responsive chart dimensions, etc.)
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

  // TODO: create dimensions$ Observable (or Observable factory) that leverages `ResizeObserver` and a HTMLElement `ref`
  // ...

  const [setRef, dimensions] = useChartDimensions({
    margin: { bottom: 40, left: 75, right: 30, top: 40 },
  });

  createEffect(() => {
    console.log('dimensions', dimensions());
  });

  return (
    // TODO: figure out chart canvas wrapper styling
    <div class="h-full w-full bg-red-800" ref={setRef}>
      Coming soon...
    </div>
  );
};
//// ---------------------------------------------------------------------------
