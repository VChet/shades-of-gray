export const GAME_HEIGHT = 320;
export const GAME_WIDTH = GAME_HEIGHT * 9 / 20;

export function createCanvas() {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");

  canvas.resize = (width, height) => {
    if (!width || !height) {
      const scale = Math.min(
        window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT
      );
      width = GAME_WIDTH * scale;
      height = GAME_HEIGHT * scale;
    }

    const scale = width / GAME_WIDTH;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
      scale * pixelRatio, 0,
      0, scale * pixelRatio,
      0, 0
    );
  };

  canvas.resize();

  return { canvas, ctx };
}
