import { type Component, Match, Switch } from 'solid-js';

import { Button } from '../../../components';
import { StopwatchState } from '../constants';
import { useStopwatch } from '../context';

export const StopwatchControls: Component = () => {
  const { addLap, reset, start, state, stop } = useStopwatch();

  return (
    <div class="flex space-x-8">
      <Switch>
        <Match when={state() === StopwatchState.Active}>
          <Button class="min-w-38" onClick={addLap}>
            Lap
          </Button>
          <Button class="min-w-38" onClick={stop} variant="destructive">
            Stop
          </Button>
        </Match>

        <Match when={state() === StopwatchState.Idle}>
          <Button class="min-w-38" disabled>
            Lap
          </Button>
          <Button class="min-w-38" onClick={start} variant="success">
            Start
          </Button>
        </Match>

        <Match when={state() === StopwatchState.Stopped}>
          <Button class="min-w-38" onClick={reset}>
            Reset
          </Button>
          <Button class="min-w-38" onClick={start} variant="success">
            Start
          </Button>
        </Match>
      </Switch>
    </div>
  );
};
