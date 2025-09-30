import { useContext } from 'solid-js';

import { StopwatchContext, type StopwatchContextValue } from './context';

export const useStopwatch = (): StopwatchContextValue => {
  const context = useContext(StopwatchContext);

  if (context === undefined) {
    throw new Error('useStopwatch must be used within a StopwatchProvider');
  }

  return context;
};
