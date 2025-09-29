import { type Component, For } from 'solid-js';

import { useStopwatch } from '../context';

import { LapRow } from './lap-row/lap-row';

export const LapsTable: Component = () => {
  const { currentLap, laps } = useStopwatch();

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

          <For each={laps}>{(lap) => <LapRow lap={lap} />}</For>
        </tbody>
      </table>
    </div>
  );
};
