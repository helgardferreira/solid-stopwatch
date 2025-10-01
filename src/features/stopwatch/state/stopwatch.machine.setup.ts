import { setup } from 'xstate';

import { currentSplitLogic } from './actors';
import type { StopwatchActorContext, StopwatchActorEvent } from './types';

export const stopwatchMachineSetup = setup({
  types: {
    context: {} as StopwatchActorContext,
    events: {} as StopwatchActorEvent,
  },
  actors: { currentSplitLogic },
});
