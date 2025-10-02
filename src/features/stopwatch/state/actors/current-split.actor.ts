import { animationFrames, map } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '../../../../types';
import type { StopwatchActorEvent } from '../types';

export type CurrentSplitActorInput = { previousSplit: number };

const currentSplit: EventObservableCreator<
  StopwatchActorEvent,
  CurrentSplitActorInput
> = ({ input }) =>
  animationFrames().pipe(
    map(({ elapsed }) => ({
      type: 'update_split',
      elapsed: Math.floor(elapsed) + input.previousSplit,
    }))
  );

export const currentSplitLogic = fromEventObservable(currentSplit);

export type CurrentSplitActorRef = ActorRefFrom<typeof currentSplitLogic>;
