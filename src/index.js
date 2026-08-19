import { createCanvas } from "./canvas.js";
import { Game } from "./game.js";

const { canvas, ctx } = createCanvas();

const game = new Game(canvas, ctx);
game.start();
