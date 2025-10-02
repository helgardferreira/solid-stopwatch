import { type ScaleLinear, type ScaleTime, format } from 'd3';
import {
  type ComponentProps,
  For,
  Show,
  createMemo,
  mergeProps,
  splitProps,
} from 'solid-js';

import type { ChartDimensions } from '../../../utils';

type AxisHorizontalProps<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
> = ComponentProps<'g'> & {
  dimensions: ChartDimensions;
  formatTick?: (tick: ReturnType<Scale['ticks']>[number]) => number | string;
  label?: string;
  scale: Scale;
};

// TODO: make tick, label, and line styling configurable (maybe through cva variants?)
// TODO: make number of ticks configurable
export function AxisHorizontal<
  Range,
  Output,
  Scale extends ScaleLinear<Range, Output> | ScaleTime<Range, Output>,
>(props: AxisHorizontalProps<Range, Output, Scale>) {
  const merged = mergeProps({ formatTick: format(',') }, props);
  const [local, rest] = splitProps(merged, [
    'dimensions',
    'formatTick',
    'label',
    'scale',
  ]);

  const numberOfTicks = createMemo(() =>
    local.dimensions.boundedWidth < 600
      ? local.dimensions.boundedWidth / 100
      : local.dimensions.boundedWidth / 250
  );

  const ticks = createMemo(() => local.scale.ticks(numberOfTicks()));

  return (
    <g transform={`translate(0, ${local.dimensions.boundedHeight})`} {...rest}>
      <line class="stroke-zinc-800" x2={local.dimensions.boundedWidth} />

      <For each={ticks()}>
        {(tick) => (
          <text
            class="text-xs transition-all duration-300 ease-out"
            text-anchor="middle"
            transform={`translate(${local.scale(tick)}, 16)`}
          >
            {local.formatTick(tick)}
          </text>
        )}
      </For>

      <Show when={local.label}>
        <text
          class="text-sm"
          text-anchor="middle"
          transform={`translate(${local.dimensions.boundedWidth / 2}, ${local.dimensions.margin.bottom / 2 + 12})`}
        >
          {local.label}
        </text>
      </Show>
    </g>
  );
}
