import type { Bin } from 'd3';

import type { Lap } from '../types';

export const yAccessor = (d: Bin<Lap, number>): number => d.length;
