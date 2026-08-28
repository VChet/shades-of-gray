const GAME_HEIGHT = 320;
const GAME_WIDTH = GAME_HEIGHT * 9 / 20;

export function createCanvas() {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");

  canvas.viewport = { width: GAME_WIDTH, height: GAME_HEIGHT };

  canvas.fitToWindow = () => {
    const { width, height } = canvas.viewport;

    const scale = Math.min(
      window.innerWidth / width,
      window.innerHeight / height
    );

    const pixelRatio = window.devicePixelRatio;

    canvas.width = width * scale * pixelRatio;
    canvas.height = height * scale * pixelRatio;

    canvas.style.width = `${width * scale}px`;
    canvas.style.height = `${height * scale}px`;

    ctx.setTransform(
      scale * pixelRatio, 0,
      0, scale * pixelRatio,
      0, 0
    );
  };

  canvas.setViewport = (width, height) => {
    canvas.viewport.width = width;
    canvas.viewport.height = height;
    canvas.fitToWindow();
  };

  canvas.setOrientation = () => {
    const portrait = window.innerHeight >= window.innerWidth;
    canvas.setViewport(
      portrait ? GAME_WIDTH : GAME_HEIGHT,
      portrait ? GAME_HEIGHT : GAME_WIDTH
    );
  };

  canvas.setOrientation();

  return { canvas, ctx };
}
