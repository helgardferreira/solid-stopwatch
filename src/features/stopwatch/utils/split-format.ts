export const splitFormat = (locales: string | readonly string[] = 'en') => {
  const millisecondsFormatter = new Intl.NumberFormat(locales, {
    minimumIntegerDigits: 3,
  });
  const smhFormatter = new Intl.NumberFormat(locales, {
    minimumIntegerDigits: 2,
  });

  return (splitMs: number) => {
    const milliseconds = splitMs % 1_000;
    const seconds = Math.floor(splitMs / 1_000) % 60;
    const minutes = Math.floor(splitMs / (1_000 * 60)) % 60;
    const hours = Math.floor(splitMs / (1_000 * 60 * 60)) % 24;

    return `${smhFormatter.format(hours)}:${smhFormatter.format(
      minutes
    )}:${smhFormatter.format(seconds)}.${millisecondsFormatter.format(
      milliseconds
    )}`;
  };
};
