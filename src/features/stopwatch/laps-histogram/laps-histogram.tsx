import { bin, max, range, scaleLinear } from 'd3';
import { type Component, For, createMemo } from 'solid-js';

import { Axis } from '../../../components';
import { useChartDimensions } from '../../../utils';
import { useStopwatch } from '../state';
import type { Lap } from '../types';
import { splitFormat, useScale } from '../utils';

import { LapsBin } from './laps-bin';
import { xAccessor } from './x-accessor';
import { yAccessor } from './y-accessor';

export const LapsHistogram: Component = () => {
  const { laps } = useStopwatch();

  const barGutter = 1;

  const hasLapWithHours = createMemo(() =>
    laps.some(({ split }) => Math.floor(split / (1000 * 60 * 60)) % 24 !== 0)
  );

  const hasLapWithMinutes = createMemo(() =>
    laps.some(({ split }) => Math.floor(split / (1000 * 60)) % 60 !== 0)
  );

  const [setRef, dimensions] = useChartDimensions({
    margin: { bottom: 45, left: 60, right: 60, top: 30 },
  });

  const binCount = createMemo(() => {
    const isNarrow = dimensions().boundedWidth < 550;

    if (isNarrow) {
      return hasLapWithHours() ? 2 : hasLapWithMinutes() ? 3 : 4;
    }

    return hasLapWithHours() || hasLapWithMinutes() ? 5 : 6;
  });

  const xScale = useScale({
    accessor: xAccessor,
    data: laps,
    nice: true,
    range: () => [0, dimensions().boundedWidth],
  });

  const xThresholds = createMemo(() => {
    const domain = xScale().domain();
    const [min, max] = domain;

    return range(min, max, (max - min) / binCount());
  });

  const xDomain = createMemo(() => {
    const xDomain = xScale().domain() as
      | [number, number]
      | [undefined, undefined];

    if (xDomain[0] === undefined || xDomain[1] === undefined) {
      throw new Error('Invalid X Domain');
    }

    return xDomain;
  });

  const bins = createMemo(() => {
    const binsGenerator = bin<Lap, number>()
      .domain(xDomain())
      .value(xAccessor)
      .thresholds(xThresholds());

    return binsGenerator(laps);
  });

  const yScale = createMemo(() => {
    const maxBinSize = max(bins(), yAccessor);

    if (maxBinSize === undefined) {
      throw new Error('Invalid Max Bin Size');
    }

    return scaleLinear()
      .domain([0, maxBinSize])
      .range([dimensions().boundedHeight, 0])
      .nice();
  });

  const splitFormatter = splitFormat({ short: true });

  const axisTicks = () => xThresholds().concat(xDomain()[1]);

  return (
    <div
      class="h-full w-full overflow-hidden rounded-md bg-zinc-50"
      ref={setRef}
    >
      <svg height={dimensions().height} id="wrapper" width={dimensions().width}>
        <g
          id="bounds"
          transform={`translate(${dimensions().margin.left}, ${dimensions().margin.top})`}
        >
          <g id="bins">
            <For each={bins()}>
              {(bin) => (
                <LapsBin
                  bin={bin}
                  barGutter={barGutter}
                  dimensions={dimensions()}
                  xScale={xScale()}
                  yScale={yScale()}
                />
              )}
            </For>
          </g>

          <Axis
            axis="x"
            dimensions={dimensions()}
            scale={xScale()}
            ticks={axisTicks()}
            formatTick={splitFormatter}
            label="Splits"
          />
        </g>
      </svg>
    </div>
  );
};
