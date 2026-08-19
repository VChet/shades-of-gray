export const GAME_WIDTH = 240;
export const GAME_HEIGHT = 320;

export function createCanvas() {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");

  function resize() {
    const scale = Math.min(
      window.innerWidth / GAME_WIDTH,
      window.innerHeight / GAME_HEIGHT
    );

    const pixelRatio = window.devicePixelRatio;

    canvas.width = GAME_WIDTH * scale * pixelRatio;
    canvas.height = GAME_HEIGHT * scale * pixelRatio;

    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;

    ctx.setTransform(
      scale * pixelRatio, 0,
      0, scale * pixelRatio,
      0, 0
    );
  }

  window.addEventListener("resize", resize);
  resize();

  return {
    canvas,
    ctx
  };
}
