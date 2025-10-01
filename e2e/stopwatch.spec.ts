import { test } from '@playwright/test';

import { assertState, executeEvent, start } from './utils';

test.describe('Stopwatch', () => {
  test('is idle', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });
  });

  test('can start', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });
  });

  test('can lap', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });

    await test.step(`Execute event {"type":"lap"}`, async () => {
      await executeEvent(sys, { type: 'lap' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });
  });

  test('can stop', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });

    await test.step(`Execute event {"type":"stop"}`, async () => {
      await executeEvent(sys, { type: 'stop' });
    });

    await test.step(`Assert state "Stopped"`, async () => {
      await assertState(sys, { value: 'Stopped' });
    });
  });

  test('can resume', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });

    await test.step(`Execute event {"type":"stop"}`, async () => {
      await executeEvent(sys, { type: 'stop' });
    });

    await test.step(`Assert state "Stopped"`, async () => {
      await assertState(sys, { value: 'Stopped' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });
  });

  test('can reset', async ({ page }) => {
    const sys = await start(page);

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });

    await test.step(`Execute event {"type":"start"}`, async () => {
      await executeEvent(sys, { type: 'start' });
    });

    await test.step(`Assert state "Active"`, async () => {
      await assertState(sys, { value: 'Active' });
    });

    await test.step(`Execute event {"type":"stop"}`, async () => {
      await executeEvent(sys, { type: 'stop' });
    });

    await test.step(`Assert state "Stopped"`, async () => {
      await assertState(sys, { value: 'Stopped' });
    });

    await test.step(`Execute event {"type":"reset"}`, async () => {
      await executeEvent(sys, { type: 'reset' });
    });

    await test.step(`Assert state "Idle"`, async () => {
      await assertState(sys, { value: 'Idle' });
    });
  });
});
