import { createMemo } from 'solid-js';

import type { ChartMargin } from '../../../utils';
import { useStopwatch } from '../state';

export const useSparklineMargin = () => {
  const { laps } = useStopwatch();

  const hasLapWithHours = createMemo(() =>
    laps.some(({ split }) => Math.floor(split / (1000 * 60 * 60)) % 24 !== 0)
  );

  const hasLapWithMinutes = createMemo(() =>
    laps.some(({ split }) => Math.floor(split / (1000 * 60)) % 60 !== 0)
  );

  const margin = createMemo<ChartMargin>(() => ({
    bottom: 45,
    left: hasLapWithHours() ? 130 : hasLapWithMinutes() ? 110 : 90,
    right: 15,
    top: 15,
  }));

  return margin;
};
