import { type Component, Match, Switch } from 'solid-js';

import { Button } from '../../../components';
import { StopwatchState, useStopwatch } from '../state';

export const StopwatchControls: Component = () => {
  const { lap, reset, snapshot, start, stop } = useStopwatch();

  return (
    <div class="flex space-x-6 sm:space-x-8">
      <Switch fallback={null}>
        <Match when={snapshot.matches(StopwatchState.Active)}>
          <Button class="min-w-30 sm:min-w-38" onClick={lap}>
            Lap
          </Button>
          <Button
            class="min-w-30 sm:min-w-38"
            onClick={stop}
            variant="destructive"
          >
            Stop
          </Button>
        </Match>

        <Match when={snapshot.matches(StopwatchState.Idle)}>
          <Button class="min-w-30 sm:min-w-38" disabled>
            Lap
          </Button>
          <Button
            class="min-w-30 sm:min-w-38"
            onClick={start}
            variant="success"
          >
            Start
          </Button>
        </Match>

        <Match when={snapshot.matches(StopwatchState.Stopped)}>
          <Button class="min-w-30 sm:min-w-38" onClick={reset}>
            Reset
          </Button>
          <Button
            class="min-w-30 sm:min-w-38"
            onClick={start}
            variant="success"
          >
            Start
          </Button>
        </Match>
      </Switch>
    </div>
  );
};
