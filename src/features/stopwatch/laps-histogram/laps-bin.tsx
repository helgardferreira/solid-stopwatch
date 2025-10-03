import { type Bin, type ScaleLinear, max } from 'd3';
import type { Component } from 'solid-js';

import type { ChartDimensions } from '../../../utils';
import type { Lap } from '../types';

import { thresholdAccessor } from './threshold-accessor';
import { yAccessor } from './y-accessor';

type LapsBinProps = {
  barGutter: number;
  bin: Bin<Lap, number>;
  dimensions: ChartDimensions;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
};

export const LapsBin: Component<LapsBinProps> = (props) => {
  const left = () => props.xScale(thresholdAccessor(props.bin, 'left'));
  const right = () => props.xScale(thresholdAccessor(props.bin, 'right'));

  const barX = () => left() + props.barGutter / 2;
  const barY = () => props.yScale(yAccessor(props.bin));

  const barHeight = () => props.dimensions.boundedHeight - barY();
  const barWidth = () => max([0, right() - left() - props.barGutter]) ?? 0;

  const labelX = () => left() + right() / 2 - left() / 2;
  const labelY = () => barY() - 4;

  return (
    <g class="bin">
      <rect
        class="fill-blue-500"
        height={barHeight()}
        width={barWidth()}
        x={barX()}
        y={barY()}
      />

      <text
        class="fill-slate-500 text-xs"
        text-anchor="middle"
        x={labelX()}
        y={labelY()}
      >
        {yAccessor(props.bin)}
      </text>
    </g>
  );
};
