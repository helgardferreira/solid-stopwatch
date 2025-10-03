import { type Numeric, type ScaleLinear, type ScaleTime, line } from 'd3';
import { type Accessor, createMemo } from 'solid-js';

type UseLinePathOptions<
  Datum,
  DatumXOutput extends Numeric,
  DatumYOutput extends Numeric,
  RangeX,
  RangeY,
  RangeXOutput,
  RangeYOutput,
> = {
  data: Datum[] | Accessor<Datum[]>;
  xAccessor: (
    datum: Datum,
    index: number,
    array: Iterable<Datum>
  ) => DatumXOutput;
  xScale:
    | Accessor<ScaleLinear<RangeX, RangeXOutput, never>>
    | Accessor<ScaleTime<RangeX, RangeXOutput, never>>;
  yAccessor: (
    datum: Datum,
    index: number,
    array: Iterable<Datum>
  ) => DatumYOutput;
  yScale:
    | Accessor<ScaleLinear<RangeY, RangeYOutput, never>>
    | Accessor<ScaleTime<RangeY, RangeYOutput, never>>;
};

export function useLinePath<
  Datum,
  DatumXOutput extends Numeric,
  DatumYOutput extends Numeric,
  RangeX extends number = number,
  RangeY extends number = number,
  RangeXOutput extends number = RangeX,
  RangeYOutput extends number = RangeY,
>(
  options: UseLinePathOptions<
    Datum,
    DatumXOutput,
    DatumYOutput,
    RangeX,
    RangeY,
    RangeXOutput,
    RangeYOutput
  >
): Accessor<string | undefined> {
  const linePath = createMemo(() => {
    const { xAccessor, xScale, yAccessor, yScale } = options;
    const data =
      typeof options.data === 'function' ? options.data() : options.data;

    const xAccessorScaled = (
      datum: Datum,
      index: number,
      array: Iterable<Datum>
    ) => xScale()(xAccessor(datum, index, array));
    const yAccessorScaled = (
      datum: Datum,
      index: number,
      array: Iterable<Datum>
    ) => yScale()(yAccessor(datum, index, array));

    const lineGenerator = line<Datum>().x(xAccessorScaled).y(yAccessorScaled);

    return lineGenerator(data) ?? undefined;
  });

  return linePath;
}
