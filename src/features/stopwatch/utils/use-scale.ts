import {
  type Numeric,
  type ScaleLinear,
  type ScaleTime,
  extent,
  scaleLinear,
  scaleTime,
} from 'd3';
import { type Accessor, createMemo } from 'solid-js';

type UseScaleOptions<
  Datum,
  DatumOutput extends Numeric,
  ScaleType extends 'linear' | 'time' | undefined,
  Range,
> = {
  accessor: (
    datum: Datum,
    index: number,
    array: Iterable<Datum>
  ) => DatumOutput;
  data: Datum[] | Accessor<Datum[]>;
  range?: Iterable<Range> | Accessor<Iterable<Range>>;
  type?: ScaleType | Accessor<ScaleType>;
};

type UseScaleResult<
  ScaleType extends 'linear' | 'time' | undefined,
  Range,
  RangeOutput,
> = ScaleType extends 'time'
  ? Accessor<ScaleTime<Range, RangeOutput, never>>
  : Accessor<ScaleLinear<Range, RangeOutput, never>>;

export const useScale = <
  Datum,
  DatumOutput extends Numeric,
  ScaleType extends 'linear' | 'time' | undefined = undefined,
  Range = number,
  RangeOutput = Range,
>(
  options: UseScaleOptions<Datum, DatumOutput, ScaleType, Range>
): UseScaleResult<ScaleType, Range, RangeOutput> => {
  const scale = createMemo(() => {
    const accessor = options.accessor;
    const data =
      typeof options.data === 'function' ? options.data() : options.data;
    const range =
      typeof options.range === 'function' ? options.range() : options.range;
    const type =
      (typeof options.type === 'function' ? options.type() : options.type) ??
      'linear';

    const domain = extent<Datum, DatumOutput>(data, accessor);

    if (domain[0] === undefined || domain[1] === undefined) {
      throw new Error('Incorrect domain');
    }

    let scale:
      | ScaleLinear<Range, RangeOutput, never>
      | ScaleTime<Range, RangeOutput, never>;

    if (type === 'linear') {
      scale = scaleLinear<Range, RangeOutput>().domain(
        domain as [DatumOutput, DatumOutput]
      );
    } else {
      scale = scaleTime<Range, RangeOutput>().domain(
        domain as [DatumOutput, DatumOutput]
      );
    }

    if (range) {
      scale.range(range);
    }

    return scale;
  });

  return scale as UseScaleResult<ScaleType, Range, RangeOutput>;
};
