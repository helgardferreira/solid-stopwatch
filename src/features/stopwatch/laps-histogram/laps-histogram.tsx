import { type Bin, bin, max, range, scaleLinear } from 'd3';
import { type Component, For, createMemo } from 'solid-js';

import { useChartDimensions } from '../../../utils';
import { useStopwatch } from '../state';
import type { Lap } from '../types';
import { useScale } from '../utils';

export const LapsHistogram: Component = () => {
  const { laps } = useStopwatch();

  const xAccessor = (d: Lap): number => d.split;
  const yAccessor = (d: Bin<Lap, number>): number => d.length;

  const [setRef, dimensions] = useChartDimensions({
    margin: { bottom: 45, left: 15, right: 15, top: 15 },
  });

  const barGutter = 10;

  const xScale = useScale({
    accessor: xAccessor,
    data: laps,
    nice: true,
    range: () => [0, dimensions().boundedWidth],
  });

  const xThresholds = createMemo(() => {
    // TODO: make `binCount` dynamic based on `dimensions().boundedWidth`
    const binCount = 4;
    const domain = xScale().domain();
    const [min, max] = domain;

    return range(min, max, (max - min) / binCount);
  });

  const bins = createMemo(() => {
    const niceXDomain = xScale().domain() as
      | [number, number]
      | [undefined, undefined];

    if (niceXDomain[0] === undefined || niceXDomain[1] === undefined) {
      throw new Error('Invalid X Domain');
    }

    const binsGenerator = bin<Lap, number>()
      .domain(niceXDomain)
      .value(xAccessor)
      .thresholds(xThresholds());

    return binsGenerator(laps);
  });

  const yScale = () => {
    const maxBinSize = max(bins(), yAccessor);

    if (maxBinSize === undefined) {
      throw new Error('Invalid Max Bin Size');
    }

    return scaleLinear()
      .domain([0, maxBinSize])
      .range([dimensions().boundedHeight, 0])
      .nice();
  };

  const leftScaledAccessor = (d: Bin<Lap, number>) => xScale()(d.x0 ?? 0);
  const rightScaledAccessor = (d: Bin<Lap, number>) => xScale()(d.x1 ?? 0);
  const yAccessorScaled = (d: Bin<Lap, number>) => yScale()(yAccessor(d));

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
              {/* // TODO: move to separate `<Bin />` component  */}
              {(d) => {
                const height = () =>
                  dimensions().boundedHeight - yAccessorScaled(d);

                const width = () =>
                  max([
                    0,
                    rightScaledAccessor(d) - leftScaledAccessor(d) - barGutter,
                  ]) ?? 0;

                const x = () => leftScaledAccessor(d) + barGutter / 2;
                const y = () => yAccessorScaled(d);

                // TODO: implement bin labels
                return (
                  <g class="bin">
                    <rect
                      class="fill-blue-500"
                      height={height()}
                      width={width()}
                      x={x()}
                      y={y()}
                    />
                  </g>
                );
              }}
            </For>
          </g>
        </g>
      </svg>
    </div>
  );
};
