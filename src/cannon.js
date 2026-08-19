import { GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";
import { getBallColor } from "./helpers/color.js";

const RADIUS = 5;
const Y_OFFSET = 16;

const ARROW_LENGTH = 25;
const ARROW_WIDTH = RADIUS;
const ARROW_SPEED = Math.PI;

const SAFE_MARGIN = RADIUS + ARROW_LENGTH;
const MIN_SHOOT_ANGLE = 5 * Math.PI / 180;

export class Cannon {
  constructor(ctx) {
    this.ctx = ctx;

    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT - Y_OFFSET;
    this.radius = RADIUS;

    this.angle = -Math.PI / 2;
    this.direction = 1;
  }

  update(deltaTime) {
    this.angle += this.direction * ARROW_SPEED * deltaTime;

    if (this.angle >= Math.PI / 2) {
      this.angle = Math.PI / 2;
      this.direction = -1;
    }

    if (this.angle <= -Math.PI / 2) {
      this.angle = -Math.PI / 2;
      this.direction = 1;
    }
  }

  getShootSpeed(radius, height, friction) {
    const distanceToTop = this.y - radius;
    const distanceToCenter = height / 2 - radius;
    const targetDistance = distanceToTop + distanceToCenter;
    return Math.sqrt(2 * friction * targetDistance);
  }

  setNextBall(level) {
    this.ballLevel = level;
  }

  getShootAngle() {
    const limit = Math.PI / 2 - MIN_SHOOT_ANGLE;
    return Math.max(-limit, Math.min(limit, this.angle));
  }

  getSafeRadius() {
    return this.radius + SAFE_MARGIN;
  }

  render() {
    const { ctx } = this;
    const color = getBallColor(this.ballLevel);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(0, -ARROW_LENGTH);
    ctx.lineTo(-ARROW_WIDTH, 0);
    ctx.lineTo(ARROW_WIDTH, 0);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
  }
}
