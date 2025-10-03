import { isEqual } from 'lodash';
import {
  type Observable,
  combineLatestWith,
  distinctUntilChanged,
  from as fromSolid,
  map,
} from 'rxjs';
import {
  type Accessor,
  type Setter,
  createMemo,
  from as fromRx,
  observable,
} from 'solid-js';

import type { DeepAccessor } from '../../types';
import { accessDeep } from '../signals';
import { useContentResize } from '../use-content-resize';

import { computeChartDimensions } from './compute-chart-dimensions';
import type { ChartDimensions, ChartMargin } from './types';

type UseChartDimensionsOptions = DeepAccessor<{
  height?: number;
  margin?: Partial<ChartMargin>;
  width?: number;
}>;

type UseChartDimensionsResult<T extends Element> = [
  setRef: Setter<T | undefined>,
  contentRect: Accessor<ChartDimensions>,
  contentRect$: Observable<ChartDimensions>,
];

export const useChartDimensions = <T extends Element>(
  options: UseChartDimensionsOptions = {}
): UseChartDimensionsResult<T> => {
  const [setRef, _, contentRect$] = useContentResize<T>();

  const optionsAccessor = createMemo(() => accessDeep(options));

  const options$ = fromSolid(observable(optionsAccessor));

  const dimensions$ = contentRect$.pipe(
    combineLatestWith(options$),
    map(([contentRect, options]) =>
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
    // eslint-disable-next-line solid/reactivity
    computeChartDimensions(optionsAccessor())
  );

  return [setRef, dimensions, dimensions$];
};
