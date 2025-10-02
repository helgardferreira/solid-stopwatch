import isEqual from 'lodash/isEqual';
import { type Observable, distinctUntilChanged, map } from 'rxjs';
import { type Accessor, type Setter, from as fromRx } from 'solid-js';

import { useContentResize } from '../use-content-resize';

import { computeChartDimensions } from './compute-chart-dimensions';
import type { ChartDimensions, ChartMargin } from './types';

type UseChartDimensionsOptions = {
  height?: number;
  margin?: Partial<ChartMargin>;
  width?: number;
};

type UseChartDimensionsResult<T extends Element> = [
  setRef: Setter<T | undefined>,
  contentRect: Accessor<ChartDimensions>,
  contentRect$: Observable<ChartDimensions>,
];

// TODO: document this
export const useChartDimensions = <T extends Element>(
  options: UseChartDimensionsOptions = {}
): UseChartDimensionsResult<T> => {
  const [setRef, _, contentRect$] = useContentResize<T>();

  const dimensions$ = contentRect$.pipe(
    map((contentRect) =>
      computeChartDimensions({
        contentRect,
        height: options.height,
        margin: options.margin,
        width: options.width,
      })
    ),
    distinctUntilChanged((a, b) => isEqual(a, b))
  );

  const dimensions = fromRx(
    dimensions$,
    computeChartDimensions({
      height: options.height,
      margin: options.margin,
      width: options.width,
    })
  );

  return [setRef, dimensions, dimensions$];
};
