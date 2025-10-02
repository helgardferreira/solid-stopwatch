import {
  extent,
  line,
  scaleLinear,
  scaleTime,
  timeFormat,
  timeParse,
} from 'd3';
import { type Component, createMemo } from 'solid-js';

import { Axis } from '../../../components';
import { useChartDimensions } from '../../../utils';
import type { WeatherDatum } from '../types';

export const xAccessor = (d: WeatherDatum): Date => {
  const parsedDate = timeParse('%Y-%m-%d')(d.date);

  if (parsedDate === null) {
    throw new Error('Invalid date provided to xAccessor');
  }

  return parsedDate;
};

export const yAccessor = (d: WeatherDatum): number => d.temperatureMax;

// TODO: remove this after initial data viz scaffold is complete
type SparklineProps = {
  dataset: WeatherDatum[];
};

// TODO: delete `src/features/stopwatch/my_weather_data.json` after initial data viz scaffold is complete
// TODO: implement sparkline chart using data from `useStopwatch`
// TODO: continue here...
export const Sparkline: Component<SparklineProps> = (props) => {
  const formatDate = timeFormat('%-b %-d');

  /*
   * Create chart dimensions
   */
  const [setRef, dimensions] = useChartDimensions({
    margin: { bottom: 30, left: 60, right: 15, top: 15 },
  });

  /*
   * Create scales
   */
  const xScale = createMemo(() => {
    const xDomain = extent<WeatherDatum, Date>(props.dataset, xAccessor);

    if (xDomain[0] === undefined || xDomain[1] === undefined) {
      throw new Error('Incorrect X domain');
    }

    return scaleTime().domain(xDomain).range([0, dimensions().boundedWidth]);
  });

  const yScale = createMemo(() => {
    const yDomain = extent<WeatherDatum, number>(props.dataset, yAccessor);

    if (yDomain[0] === undefined || yDomain[1] === undefined) {
      throw new Error('Incorrect Y domain');
    }

    return scaleLinear().domain(yDomain).range([dimensions().boundedHeight, 0]);
  });

  const weatherLine = createMemo(() => {
    const xAccessorScaled = (d: WeatherDatum) => xScale()(xAccessor(d));
    const yAccessorScaled = (d: WeatherDatum) => yScale()(yAccessor(d));

    const lineGenerator = line<WeatherDatum>()
      .x(xAccessorScaled)
      .y(yAccessorScaled);

    return lineGenerator(props.dataset) ?? undefined;
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
          <path
            class="stroke-blue-400 stroke-2"
            d={weatherLine()}
            fill="none"
          />

          <Axis
            axis="x"
            dimensions={dimensions()}
            formatTick={formatDate}
            scale={xScale()}
          />
          <Axis
            axis="y"
            dimensions={dimensions()}
            label="Temperature"
            scale={yScale()}
          />
        </g>
      </svg>
    </div>
  );
};
