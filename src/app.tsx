import { createSignal } from 'solid-js';

import solidLogo from './assets/solid.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="flex min-h-screen min-w-xs place-items-center">
      <div class="mx-auto flex max-w-7xl flex-col space-y-10 p-8 text-center">
        <div class="flex justify-center">
          <a href="https://vite.dev">
            <img
              alt="Vite logo"
              class="h-36 p-6 transition duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
              src={viteLogo}
            />
          </a>

          <a href="https://solidjs.com">
            <img
              alt="Solid logo"
              class="h-36 p-6 transition duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]"
              src={solidLogo}
            />
          </a>
        </div>

        <h1 class="text-5xl font-semibold">Vite + Solid</h1>

        <div class="flex flex-col items-center space-y-4 p-8">
          <button
            class="w-fit cursor-pointer rounded-lg border border-transparent bg-[#f9f9f9] px-5 py-2 font-medium transition duration-250 hover:border-[#646cff]"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count()}
          </button>

          <p class="font-light">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <p class="text-neutral-400">
          Click on the Vite and Solid logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
