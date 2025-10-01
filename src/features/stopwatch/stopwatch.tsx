import { useActor } from '@xstate/solid';
import { type Component, Match, Switch, createMemo } from 'solid-js';

import { Button } from '../../components';

import { stopwatchMachine } from './machine/stopwatch.machine';
import { splitFormat } from './utils';

// TODO: add data visualizations with d3 later
// TODO: reimplement with both XState and RxJS, for finished project, later
// TODO: reimplement with XState (without RxJS), for learning purposes, later
//       - first implement state machine singleton
//       - then figure out most idiomatic way to share state machine dependency via context
//       - then figure out Stopwatch component-scoped lifecycle management for state machine
// TODO: continue here...
export const Stopwatch: Component = () => {
  // TODO: remove this after debugging
  /*
  const { currentTotal } = useStopwatch();

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentTotal())
  );
  */

  const [snapshot, send, _actorRef] = useActor(stopwatchMachine);

  const currentSplit = () => snapshot.context.currentSplit;

  const splitFormatter = splitFormat();

  const formattedCurrentTotal = createMemo(() =>
    splitFormatter(currentSplit())
  );

  // TODO: move this
  // ---------------------------------------------------------------------------
  // TODO: implement / refactor this
  const lap = () => {
    send({ type: 'lap' });
  };

  // TODO: implement / refactor this
  const reset = () => {
    send({ type: 'reset' });
  };

  // TODO: implement / refactor this
  const start = () => {
    send({ type: 'start' });
  };

  // TODO: implement / refactor this
  const stop = () => {
    send({ type: 'stop' });
  };
  // ---------------------------------------------------------------------------

  return (
    <div class="grid h-screen grid-rows-[6rem_1fr_1.75rem] place-items-center gap-y-12 p-8">
      <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

      {/* // TODO: remove this after debugging */}
      {/* // --------------------------------------------------------------- */}
      <div class="flex space-x-8">
        <Switch fallback={null}>
          {/* <Match when={state() === StopwatchState.Active}> */}
          <Match when={snapshot.matches('Active')}>
            <Button class="min-w-38" onClick={lap}>
              Lap
            </Button>
            <Button class="min-w-38" onClick={stop} variant="destructive">
              Stop
            </Button>
          </Match>

          {/* <Match when={state() === StopwatchState.Idle}> */}
          <Match when={snapshot.matches('Idle')}>
            <Button class="min-w-38" disabled>
              Lap
            </Button>
            <Button class="min-w-38" onClick={start} variant="success">
              Start
            </Button>
          </Match>

          {/* <Match when={state() === StopwatchState.Stopped}> */}
          <Match when={snapshot.matches('Stopped')}>
            <Button class="min-w-38" onClick={reset}>
              Reset
            </Button>
            <Button class="min-w-38" onClick={start} variant="success">
              Start
            </Button>
          </Match>
        </Switch>
      </div>
      {/* // --------------------------------------------------------------- */}

      {/* // TODO: restore this after debugging */}
      {/* <p class="font-mono text-8xl">{formattedCurrentTotal()}</p>

      <LapsTable />

      <StopwatchControls /> */}
    </div>
  );
};
