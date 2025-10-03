import { maxIndex, minIndex } from 'd3';

import type { Lap } from '../../types';
import { stopwatchMachineSetup } from '../stopwatch.machine.setup';

export const addLap = stopwatchMachineSetup.assign(({ context }) => {
  const { currentSplit, laps } = context;

  const lapNumber = laps.length + 1;
  const previousTotal = laps[0]?.total ?? 0;
  const total = previousTotal + currentSplit;

  let newLaps: Lap[] = [
    {
      isFastest: false,
      isSlowest: false,
      lapNumber,
      split: currentSplit,
      timestamp: new Date(),
      total,
    },
    ...laps,
  ];

  if (newLaps.length >= 2) {
    const fastestIdx = minIndex(newLaps, (d) => d.split);
    const slowestIdx = maxIndex(newLaps, (d) => d.split);

    newLaps = newLaps.map((lap, idx) => {
      return {
        ...lap,
        isFastest: idx === fastestIdx,
        isSlowest: idx === slowestIdx,
      };
    });
  }

  return {
    currentSplit: 0,
    laps: newLaps,
  };
});
