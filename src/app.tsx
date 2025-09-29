import { timeFormat } from 'd3';
import {
  type Component,
  For,
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

import { Button } from './components';

// TODO: move this
export enum StopwatchState {
  Active = 'active',
  Idle = 'idle',
  Stopped = 'stopped',
}

// TODO: move this
export type Split = {
  split: number;
  total: number;
};

// TODO: reimplement with both XState and RxJS, for finished project, later
// TODO: reimplement with XState (without RxJS), for learning purposes, later
// TODO: reimplement with RxJS, for learning purposes, later
// TODO: add data visualizations with d3 later
// TODO: extract logic into separate hook(s)
// TODO: implement slowest lap and fastest lap highlight
// TODO: implement lap logic
// TODO: implement splits
// TODO: continue here...
const App: Component = () => {
  // TODO: maybe refactor this into one store?
  // ---------------------------------------------------------------------------
  // TODO: refactor this into a store
  const [splits, setSplits] = createSignal<Split[]>([]);
  const [currentSplit, setCurrentSplit] = createSignal(0);
  const [state, setState] = createSignal(StopwatchState.Idle);
  // ---------------------------------------------------------------------------

  // TODO: implement ms time format similar to Apple "Clock" App
  const timeFormatter = timeFormat('%H:%M:%S.%L');

  // TODO: refactor this
  // ---------------------------------------------------------------------------
  const referenceDate = new Date(0, 0, 0, 0, 0, 0, 0);
  const splitDate = new Date(0, 0, 0, 0, 0, 0, 0);
  const totalDate = new Date(0, 0, 0, 0, 0, 0, 0);
  // ---------------------------------------------------------------------------

  const formattedCurrentSplit = createMemo(() => {
    splitDate.setTime(referenceDate.getTime() + currentSplit());

    return timeFormatter(splitDate);
  });

  const formattedCurrentTotal = createMemo(() => {
    const previousTotal = splits().at(0)?.total;

    if (!previousTotal) {
      return formattedCurrentSplit();
    }

    totalDate.setTime(referenceDate.getTime() + currentSplit() + previousTotal);

    return timeFormatter(totalDate);
  });

  const currentLap = () => splits().length + 1;

  createEffect(
    on([state, splits], ([state]) => {
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
      const split = currentSplit();
      const previousTotal = splits().at(0)?.total ?? 0;
      const total = previousTotal + split;

      setCurrentSplit(0);
      setSplits([{ split, total }, ...splits()]);
    });
  };

  // TODO: maybe refactor this?
  const handleResetClick = () => {
    batch(() => {
      setCurrentSplit(0);
      setSplits([]);
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
    <div class="flex min-h-screen flex-col items-center justify-between p-8">
      <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

      <Show when={state() !== StopwatchState.Idle}>
        {/* // TODO: move this into separate component */}
        {/* ////// --------------------------------------------------------- */}
        {/* // TODO: add maximum height with overflow-y: auto */}
        <table class="w-full max-w-md table-fixed border-collapse">
          <thead>
            <tr class="text-xs *:py-2 *:font-medium *:text-slate-500">
              <th class="text-start">Lap No.</th>
              <th class="text-center">Split</th>
              <th class="text-end">Total</th>
            </tr>
          </thead>

          <tbody class="text-sm *:*:py-1 *:not-last:border-y *:not-last:border-slate-300">
            {/* // TODO: implement this */}
            {/* // --------------------------------------------------------- */}
            <tr>
              <td class="text-start">Lap {currentLap()}</td>
              <td class="text-center font-mono">{formattedCurrentSplit()}</td>
              <td class="text-end font-mono">{formattedCurrentTotal()}</td>
            </tr>
            {/* // --------------------------------------------------------- */}

            <For each={splits()}>
              {/* // TODO: refactor into separate child component */}
              {/* ////// --------------------------------------------------- */}
              {({ split, total }, idx) => {
                console.log('creating split row:', split);

                const getFormattedMs = (ms: number) => {
                  const referenceDate = new Date();
                  referenceDate.setHours(0);
                  referenceDate.setMinutes(0);
                  referenceDate.setSeconds(0);
                  referenceDate.setMilliseconds(0);

                  return timeFormatter(new Date(referenceDate.getTime() + ms));
                };

                const lapNumber = () => splits().length - idx();
                const formattedSplit = getFormattedMs(split);
                const formattedTotal = getFormattedMs(total);

                return (
                  <tr>
                    <td class="text-start">Lap {lapNumber()}</td>
                    <td class="text-center font-mono">{formattedSplit}</td>
                    <td class="text-end font-mono">{formattedTotal}</td>
                  </tr>
                );
              }}
              {/* ////// --------------------------------------------------- */}
            </For>
          </tbody>
        </table>
        {/* ////// --------------------------------------------------------- */}
      </Show>

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

export default App;
