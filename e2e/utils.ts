import { type Page, expect } from '@playwright/test';
import { type AnyEventObject, matchesState } from 'xstate';

export async function start(page: Page) {
  await page.goto('http://localhost:3000');

  return page;
}

// Assert that the system under test (`sys`) is in the correct state
export async function assertState(sys: Page, state: { value: string }) {
  if (matchesState('Idle', state.value)) {
    // Assert `sys` is in state "stopwatch.Idle"
    await expect(sys.getByRole('button', { name: 'Lap' })).toBeVisible();
    await expect(sys.getByRole('button', { name: 'Lap' })).toBeDisabled();
    await expect(sys.getByRole('button', { name: 'Start' })).toBeVisible();
  }

  if (matchesState('Active', state.value)) {
    // Assert `sys` is in state "stopwatch.Active"
    await expect(sys.getByRole('button', { name: 'Lap' })).toBeVisible();
    await expect(sys.getByRole('button', { name: 'Lap' })).toBeEnabled();
    await expect(sys.getByRole('button', { name: 'Stop' })).toBeVisible();
  }

  if (matchesState('Stopped', state.value)) {
    // Assert `sys` is in state "stopwatch.Stopped"
    await expect(sys.getByRole('button', { name: 'Reset' })).toBeVisible();
    await expect(sys.getByRole('button', { name: 'Start' })).toBeVisible();
  }
}

export async function executeEvent(sys: Page, event: AnyEventObject) {
  // execute the event on the system under test
  switch (event.type) {
    case 'start': {
      // Execute the action that results in
      // the "start" event occurring
      await sys.getByRole('button', { name: 'Start' }).click();

      break;
    }

    case 'lap': {
      // Execute the action that results in
      // the "lap" event occurring
      await sys.getByRole('button', { name: 'Lap' }).click();

      break;
    }

    case 'stop': {
      // Execute the action that results in
      // the "stop" event occurring
      await sys.getByRole('button', { name: 'Stop' }).click();

      break;
    }

    case 'reset': {
      // Execute the action that results in
      // the "reset" event occurring
      await sys.getByRole('button', { name: 'Reset' }).click();

      break;
    }

    default: {
      throw new Error(`Unhandled event: ${event.type}`);
    }
  }
}
