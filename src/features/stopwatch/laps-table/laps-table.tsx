import { type Component, For } from 'solid-js';

import type { Lap } from '../types';

import { LapRow } from './lap-row/lap-row';

type LapsTableProps = {
  currentSplit: number;
  currentTotal: number;
  laps: Lap[];
};

export const LapsTable: Component<LapsTableProps> = (props) => {
  const currentLap = (): Lap => ({
    lapNumber: props.laps.length + 1,
    split: props.currentSplit,
    total: props.currentTotal,
  });

  return (
    <div class="max-h-[60vh] max-w-md overflow-y-auto px-4">
      <table class="w-full table-fixed border-collapse">
        <thead>
          <tr class="text-xs *:py-2 *:font-medium *:text-zinc-500 dark:*:text-zinc-600">
            <th class="text-start">Lap No.</th>
            <th class="text-center">Split</th>
            <th class="text-end">Total</th>
          </tr>
        </thead>

        <tbody class="text-sm *:*:py-1 *:not-last:border-y *:not-last:border-zinc-300 dark:*:not-last:border-zinc-700">
          <LapRow lap={currentLap()} />

          <For each={props.laps}>{(lap) => <LapRow lap={lap} />}</For>
        </tbody>
      </table>
    </div>
  );
};
