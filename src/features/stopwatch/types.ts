// TODO: remove this after initial data viz scaffold is complete
import type dataset from './my_weather_data.json';

export type Lap = {
  isFastest?: boolean;
  isSlowest?: boolean;
  lapNumber: number;
  split: number;
  total: number;
};

// TODO: remove this after initial data viz scaffold is complete
export type WeatherDatum = (typeof dataset)[number];
