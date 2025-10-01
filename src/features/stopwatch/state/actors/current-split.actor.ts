import { type CallbackLogicFunction, fromCallback } from 'xstate';

import type { LapEvent, StopwatchActorEvent } from '../types';

export type CurrentSplitActorInput = { previousSplit: number };

const currentSplitCallback: CallbackLogicFunction<
  LapEvent,
  StopwatchActorEvent,
  CurrentSplitActorInput
> = ({ input, sendBack }) => {
  const previousSplit = input.previousSplit;

  let requestId: number | undefined;
  let start: number | undefined;

  const step = (highResTimestamp: number) => {
    const timestamp = Math.floor(highResTimestamp);

    if (start === undefined) {
      start = timestamp;
    }

    const elapsed = timestamp - start;

    sendBack({ type: 'update_split', elapsed: elapsed + previousSplit });
    requestId = requestAnimationFrame(step);
  };

  requestId = requestAnimationFrame(step);

  return () => {
    if (requestId !== undefined) {
      cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  };
};

export const currentSplitLogic = fromCallback(currentSplitCallback);
