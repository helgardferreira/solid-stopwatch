export type Lap = {
  isFastest?: boolean;
  isSlowest?: boolean;
  lapNumber: number;
  split: number;
  timestamp?: Date;
  total: number;
};
