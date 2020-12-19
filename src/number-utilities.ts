export const parseIntSafe = (input: string) => {
  if (/^\d+$/.test(input) === false) {
    return null;
  }
  return parseInt(input, 10);
};
