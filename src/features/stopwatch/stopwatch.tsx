import {
  type Component,
  Match,
  Show,
  Switch,
  batch,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from 'solid-js';

import { Button } from '../../components';

import { StopwatchState } from './constants';
import { LapsTable } from './laps-table/laps-table';
import type { Lap } from './types';
import { splitFormat } from './utils';

// TODO: reimplement with both XState and RxJS, for finished project, later
// TODO: reimplement with XState (without RxJS), for learning purposes, later
// TODO: reimplement with RxJS, for learning purposes, later
// TODO: add data visualizations with d3 later
// TODO: extract currentSplit state management into separate module (should probably use either context or exported store singleton)
// TODO: extract logic into separate hook(s)
// TODO: implement slowest lap and fastest lap highlight
// TODO: continue here...
export const Stopwatch: Component = () => {
  const splitFormatter = splitFormat();

  // TODO: maybe refactor this into one store?
  // ---------------------------------------------------------------------------
  const [currentSplit, setCurrentSplit] = createSignal(0);

  // TODO: refactor this into a store
  const [laps, setLaps] = createSignal<Lap[]>([]);

  const [state, setState] = createSignal(StopwatchState.Idle);
  // ---------------------------------------------------------------------------

  const currentTotal = createMemo(() => {
    const previousTotal = laps()[0]?.total ?? 0;
    return previousTotal + currentSplit();
  });

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );

  // TODO: maybe refactor this?
  createEffect(
    on([state, laps], ([state]) => {
      let requestId: number | undefined;
      const previousSplit = currentSplit();

      if (state === StopwatchState.Active) {
        let start: number | undefined;

        const step = (highResTimestamp: number) => {
          const timestamp = Math.floor(highResTimestamp);

          if (start === undefined) {
            start = timestamp;
          }

          const delta = timestamp - start;

          setCurrentSplit(delta + previousSplit);
          requestId = requestAnimationFrame(step);
        };

        requestId = requestAnimationFrame(step);
      }

      onCleanup(() => {
        if (requestId !== undefined) {
          cancelAnimationFrame(requestId);
          requestId = undefined;
        }
      });
    })
  );

  // TODO: maybe refactor this?
  const handleLapClick = () => {
    batch(() => {
      const lapNumber = laps().length + 1;
      const previousTotal = laps()[0]?.total ?? 0;
      const split = currentSplit();
      const total = previousTotal + split;

      setCurrentSplit(0);
      setLaps([{ lapNumber, split, total }, ...laps()]);
    });
  };

  // TODO: maybe refactor this?
  const handleResetClick = () => {
    batch(() => {
      setCurrentSplit(0);
      setLaps([]);
      setState(StopwatchState.Idle);
    });
  };

  // TODO: maybe refactor this?
  const handleStartClick = () => {
    setState(StopwatchState.Active);
  };

  // TODO: maybe refactor this?
  const handleStopClick = () => {
    setState(StopwatchState.Stopped);
  };

  return (
    // TODO: refactor this to use CSS grid and not flex for main layout
    <div class="flex min-h-screen flex-col items-center justify-between p-8">
      <div class="flex w-full flex-col items-center space-y-10">
        <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

        <Show when={state() !== StopwatchState.Idle}>
          <LapsTable
            currentSplit={currentSplit()}
            currentTotal={currentTotal()}
            laps={laps()}
          />
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
