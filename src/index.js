import { createCanvas } from "./game/canvas.js";
import { Game } from "./game/index.js";
import { createMenu } from "./menu.js";

const { canvas, ctx } = createCanvas();

const game = new Game(canvas, ctx);
game.start();

createMenu(game);
