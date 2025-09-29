import { type Component, Match, Show, Switch, createMemo } from 'solid-js';

import { Button } from '../../components';

import { StopwatchState } from './constants';
import { useStopwatch } from './context';
import { LapsTable } from './laps-table/laps-table';
import { splitFormat } from './utils';

// TODO: add data visualizations with d3 later
// TODO: reimplement with both XState and RxJS, for finished project, later
// TODO: reimplement with XState (without RxJS), for learning purposes, later
// TODO: reimplement with RxJS, for learning purposes, later
// TODO: continue here...
export const Stopwatch: Component = () => {
  const { addLap, currentTotal, reset, start, state, stop } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  const handleLapClick = () => addLap();

  const handleResetClick = () => reset();

  const handleStartClick = () => start();

  const handleStopClick = () => stop();

  return (
    <div class="flex min-h-screen flex-col items-center justify-between p-8">
      <div class="flex w-full flex-col items-center space-y-10">
        <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

        <Show when={state() !== StopwatchState.Idle}>
          <LapsTable />
        </Show>
      </div>

      <div class="flex space-x-8">
        <Switch>
          <Match when={state() === StopwatchState.Active}>
            <Button class="min-w-38" onClick={handleLapClick}>
              Lap
            </Button>
            <Button
              class="min-w-38"
              onClick={handleStopClick}
              variant="destructive"
            >
              Stop
            </Button>
          </Match>

          <Match when={state() === StopwatchState.Idle}>
            <Button class="min-w-38" disabled>
              Lap
            </Button>
            <Button
              class="min-w-38"
              onClick={handleStartClick}
              variant="success"
            >
              Start
            </Button>
          </Match>

          <Match when={state() === StopwatchState.Stopped}>
            <Button class="min-w-38" onClick={handleResetClick}>
              Reset
            </Button>
            <Button
              class="min-w-38"
              onClick={handleStartClick}
              variant="success"
            >
              Start
            </Button>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
