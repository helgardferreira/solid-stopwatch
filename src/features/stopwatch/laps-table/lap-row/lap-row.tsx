import { type Component } from 'solid-js';

import type { Lap } from '../../types';
import { splitFormat } from '../../utils';

type LapRowProps = {
  lap: Lap;
};

export const LapRow: Component<LapRowProps> = (props) => {
  const splitFormatter = splitFormat();
  const formattedSplit = () => splitFormatter(props.lap.split);
  const formattedTotal = () => splitFormatter(props.lap.total);

  return (
    <tr
      classList={{
        'text-green-500': props.lap.isFastest,
        'text-red-500': props.lap.isSlowest,
      }}
    >
      <td class="text-start">Lap {props.lap.lapNumber}</td>
      <td class="text-center font-mono">{formattedSplit()}</td>
      <td class="text-end font-mono">{formattedTotal()}</td>
    </tr>
  );
};
