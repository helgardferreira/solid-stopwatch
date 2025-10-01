import type { Lap } from '../types';

export type StopwatchActorContext = {
  currentSplit: number;
  laps: Lap[];
};

export type LapEvent = { type: 'lap' };
export type ResetEvent = { type: 'reset' };
export type StartEvent = { type: 'start' };
export type StopEvent = { type: 'stop' };
export type UpdateSplitEvent = { type: 'update_split'; elapsed: number };

export type StopwatchActorEvent =
  | LapEvent
  | ResetEvent
  | StartEvent
  | StopEvent
  | UpdateSplitEvent;
