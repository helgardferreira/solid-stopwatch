import { timeFormat } from 'd3';
import {
  type Component,
  type ComponentProps,
  Show,
  batch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
} from 'solid-js';

import { cn } from './utils';

// TODO: move this
//// ---------------------------------------------------------------------------
export type ButtonProps = ComponentProps<'button'>;

// TODO: implement variants via `class-variance-authority`
// TODO: continue here...
export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['class']);

  // TODO: implement styling
  return (
    <button
      class={cn(
        'bg-slate-950',
        'border',
        'cursor-pointer',
        'focus-visible:outline-2',
        'hover:bg-slate-800',
        'min-w-38',
        'outline-offset-1',
        'rounded-full',
        'text-white',
        local.class
      )}
      {...rest}
    />
  );
};
//// ---------------------------------------------------------------------------

// TODO: extract logic into separate hook(s)
// TODO: implement the following buttons:
//       - Lap
//        - Lap should also be the first "left" button but in a disabled state at first
//       - Stop
//       - Reset
//       - Start
// TODO: continue here...
const App: Component = () => {
  const [previousElapsedMs, setPreviousElapsedMs] = createSignal(0);
  const [elapsedMs, setElapsedMs] = createSignal(0);
  const [isActive, setIsActive] = createSignal(false);

  // TODO: implement ms time format similar to Apple "Clock" App
  const timeFormatter = timeFormat('%H:%M:%S.%L');

  const referenceDate = new Date();
  referenceDate.setHours(0);
  referenceDate.setMinutes(0);
  referenceDate.setSeconds(0);
  referenceDate.setMilliseconds(0);

  const elapsedDate = new Date();
  elapsedDate.setHours(0);
  elapsedDate.setMinutes(0);
  elapsedDate.setSeconds(0);
  elapsedDate.setMilliseconds(0);

  // TODO: implement this
  const formattedElapsedTime = createMemo(() => {
    elapsedDate.setTime(referenceDate.getTime() + elapsedMs());

    return timeFormatter(elapsedDate);
  });

  createEffect(() => {
    let requestId: number | undefined;

    if (isActive()) {
      let start: number | undefined;

      function step(timestamp: number) {
        if (start === undefined) {
          start = timestamp;
        }

        const delta = timestamp - start;

        setElapsedMs(delta + previousElapsedMs());
        requestId = requestAnimationFrame(step);
      }

      requestId = requestAnimationFrame(step);
    }

    onCleanup(() => {
      if (requestId !== undefined) {
        cancelAnimationFrame(requestId);
        requestId = undefined;
      }
    });
  });

  // TODO: implement this
  function handleLapClick() {
    //
  }

  // TODO: implement this
  function handleStartClick() {
    setIsActive(true);
  }

  // TODO: implement this
  function handleStopClick() {
    batch(() => {
      setPreviousElapsedMs(elapsedMs());
      setIsActive(false);
    });
  }

  return (
    <div class="flex min-h-screen flex-col items-center justify-between p-8">
      <p class="font-mono text-8xl">{formattedElapsedTime()}</p>

      <div class="flex space-x-4">
        {/* // TODO: leverage `<Show />` or `<Match />` for conditional rendering the various buttons */}
        <Button onClick={handleLapClick}>Lap</Button>
        <Show
          when={isActive()}
          fallback={<Button onClick={handleStartClick}>Start</Button>}
        >
          <Button onClick={handleStopClick}>Stop</Button>
        </Show>
      </div>
    </div>
  );
};

export default App;
