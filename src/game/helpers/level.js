const MAX_BALL_LEVEL = 5;

export function randomBallLevel() {
  // Generate exponentially decreasing weights so lower levels are more common
  const ratio = 1 - 1 / MAX_BALL_LEVEL;
  const weights = Array.from({ length: MAX_BALL_LEVEL }, (_, level) => ratio ** level);

  const total = weights.reduce((acc, weight) => acc + weight, 0);
  let random = Math.random() * total;

  for (const [level, weight] of weights.entries()) {
    random -= weight;
    if (random < 0) return level;
  }
}
