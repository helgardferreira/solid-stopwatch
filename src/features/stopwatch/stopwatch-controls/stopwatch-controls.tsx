import { type Component, Match, Switch } from 'solid-js';

import { Button } from '../../../components';
import { useStopwatch } from '../state';

export const StopwatchControls: Component = () => {
  const { lap, reset, snapshot, start, stop } = useStopwatch();

  return (
    <div class="flex space-x-8">
      <Switch fallback={null}>
        <Match when={snapshot.matches('Active')}>
          <Button class="min-w-38" onClick={lap}>
            Lap
          </Button>
          <Button class="min-w-38" onClick={stop} variant="destructive">
            Stop
          </Button>
        </Match>

        <Match when={snapshot.matches('Idle')}>
          <Button class="min-w-38" disabled>
            Lap
          </Button>
          <Button class="min-w-38" onClick={start} variant="success">
            Start
          </Button>
        </Match>

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
  );
};
