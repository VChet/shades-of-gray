export function getBallColor(level) {
  const brightness = 255 - level * 50;
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}
