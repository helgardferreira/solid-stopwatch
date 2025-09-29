import { type Component } from 'solid-js';

import { Stopwatch, StopwatchProvider } from './features/stopwatch';

const App: Component = () => {
  return (
    <StopwatchProvider>
      <Stopwatch />
    </StopwatchProvider>
  );
};

export default App;
