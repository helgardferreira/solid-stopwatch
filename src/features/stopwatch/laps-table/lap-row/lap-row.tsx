import type { Component } from 'solid-js';

import type { Lap } from '../../types';
import { splitFormat } from '../../utils';

type LapRowProps = {
  lap: Lap;
};

export const LapRow: Component<LapRowProps> = (props) => {
  // TODO: remove this after debugging
  // eslint-disable-next-line solid/reactivity
  console.log('creating split row:', props.lap.split);

  const splitFormatter = splitFormat();
  const formattedSplit = () => splitFormatter(props.lap.split);
  const formattedTotal = () => splitFormatter(props.lap.total);

  return (
    <tr>
      <td class="text-start">Lap {props.lap.lapNumber}</td>
      <td class="text-center font-mono">{formattedSplit()}</td>
      <td class="text-end font-mono">{formattedTotal()}</td>
    </tr>
  );
};
