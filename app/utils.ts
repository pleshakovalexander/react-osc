export const closestNoteFrequency = (frequency: number): number => {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  return 440 * Math.pow(2, (midi - 69) / 12);
};
