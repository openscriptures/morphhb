export const generateNumbers = (count: number): number[] => {
  const result = [];
  for (let i = 1; i <= count; i++) result.push(i);
  return result;
};

export const later = (delay: number, value?: unknown) => {
  return new Promise((resolve) => setTimeout(resolve, delay, value));
};
