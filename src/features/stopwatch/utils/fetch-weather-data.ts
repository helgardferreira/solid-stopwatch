import type { WeatherDatum } from '../types';

// TODO: remove this after initial data viz scaffold is complete
export const fetchWeatherData = async (): Promise<WeatherDatum[]> => {
  const url = new URL('../my_weather_data.json', import.meta.url).href;

  return (await fetch(url)).json();
};
