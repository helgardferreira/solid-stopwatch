import type { Bin } from 'd3';

import type { Lap } from '../types';

export function thresholdAccessor(
  d: Bin<Lap, number>,
  side: 'left' | 'right'
): number {
  const value = side === 'left' ? d.x0 : d.x1;

  return value ?? 0;
}
