import { Ball } from "./ball.js";
import { Cannon } from "./cannon.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";

const RADIUS = 5;
const INITIAL_SPEED = 300;
const MAX_BALL_LEVEL = 5;

function randomBallLevel() {
  return Math.floor(Math.random() * MAX_BALL_LEVEL);
}

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.previousTime = performance.now();

    this.state = "aiming";
    this.destroyedBalls = 0;

    this.cannon = new Cannon(ctx);

    this.balls = [];
    this.nextBallLevel = randomBallLevel();
    this.cannon.setNextBall(this.nextBallLevel);
    this.canvas.addEventListener("pointerdown", this.shoot);
  }

  getFriction() {
    const distanceToTop = this.cannon.y - RADIUS;
    const distanceToCenter = GAME_HEIGHT / 2 - RADIUS;
    const targetDistance = distanceToTop + distanceToCenter;
    return INITIAL_SPEED ** 2 / (targetDistance * 2);
  }

  updateFlyingBall(deltaTime) {
    const ball = this.balls.at(-1);
    ball.setPosition(deltaTime);
    if (ball.isOutOfBounds(GAME_HEIGHT)) return this.reset();
    ball.bounce(GAME_WIDTH);

    const hitBall = ball.bounceFromOthers(this.balls);
    if (hitBall?.hit()) {
      this.balls.splice(this.balls.indexOf(hitBall), 1);
      this.destroyedBalls += 1;
    }

    ball.setVelocity(this.getFriction(), deltaTime);

    if (ball.isStopped()) {
      ball.vx = 0;
      ball.vy = 0;
      this.state = "growing";
    }
  }

  updateGrowingBall(deltaTime) {
    const ball = this.balls.at(-1);
    const maxRadius = ball.getMaxRadius(this.balls, GAME_WIDTH, GAME_HEIGHT, this.cannon);
    if (maxRadius === null) {
      this.balls.pop();
      this.state = "aiming";
      return;
    }

    const finished = ball.grow(deltaTime, maxRadius);
    if (finished) this.state = "aiming";
  }

  update(deltaTime) {
    if (this.state === "aiming") this.cannon.update(deltaTime);
    else if (this.state === "flying") this.updateFlyingBall(deltaTime);
    else if (this.state === "growing") this.updateGrowingBall(deltaTime);
  }

  reset() {
    this.balls = [];
    this.state = "aiming";
    this.destroyedBalls = 0;
  }

  render() {
    const { ctx } = this;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.cannon.render();
    for (const ball of this.balls) ball.render();
  }

  shoot = () => {
    if (this.state !== "aiming") return;
    this.state = "flying";

    const ball = new Ball(
      this.ctx,
      this.cannon.x,
      this.cannon.y,
      this.cannon.getShootAngle(),
      INITIAL_SPEED,
      RADIUS,
      this.nextBallLevel
    );
    this.balls.push(ball);

    this.nextBallLevel = randomBallLevel();
    this.cannon.setNextBall(this.nextBallLevel);
  };

  start() {
    requestAnimationFrame(this.loop);
  }

  loop = (time) => {
    const deltaTime = (time - this.previousTime) / 1000;
    this.previousTime = time;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.loop);
  };
}
