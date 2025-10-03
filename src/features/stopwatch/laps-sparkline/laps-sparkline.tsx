import { type Component } from 'solid-js';

import { Axis } from '../../../components';
import { useChartDimensions } from '../../../utils';
import { useStopwatch } from '../state';
import type { Lap } from '../types';
import { splitFormat, useLinePath, useScale } from '../utils';

import { useSparklineMargin } from './use-sparkline-margin';

export const LapsSparkline: Component = () => {
  const { laps } = useStopwatch();

  const splitFormatter = splitFormat({ short: true });
  const xAccessor = (d: Lap): number => d.lapNumber;
  const yAccessor = (d: Lap): number => d.split;

  const margin = useSparklineMargin();
  const [setRef, dimensions] = useChartDimensions({ margin });

  const xScale = useScale({
    accessor: xAccessor,
    data: laps,
    range: () => [0, dimensions().boundedWidth],
  });
  const yScale = useScale({
    accessor: yAccessor,
    data: laps,
    nice: true,
    range: () => [dimensions().boundedHeight, 0],
  });
  const linePath = useLinePath({
    data: laps,
    xAccessor,
    xScale,
    yAccessor,
    yScale,
  });

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
          <path class="stroke-blue-400 stroke-2" d={linePath()} fill="none" />

          <Axis
            axis="x"
            dimensions={dimensions()}
            label="Lap No."
            scale={xScale()}
          />
          <Axis
            axis="y"
            dimensions={dimensions()}
            formatTick={splitFormatter}
            label="Split"
            scale={yScale()}
          />
        </g>
      </svg>
    </div>
  );
};
