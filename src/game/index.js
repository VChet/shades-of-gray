import { Ball } from "./ball.js";
import { Cannon } from "./cannon.js";
import { GAME_WIDTH, GAME_HEIGHT } from "./canvas.js";
import { readValue, removeValue, writeValue } from "./helpers/storage.js";
import { addRecord, getBestScore } from "./leaderboard.js";
import { playSound } from "./sound.js";

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

    this.paused = false;
    this.state = "aiming";
    this.statsDom = {
      score: document.querySelector("#score"),
      last: document.querySelector("#last"),
      best: document.querySelector("#best")
    };
    this.last = 0;
    this.score = 0;
    this.updateStats();

    this.cannon = new Cannon(ctx);
    this.balls = [];

    const restored = this.restoreSnapshot();
    if (!restored) {
      this.nextBallLevel = randomBallLevel();
      this.cannon.setNextBall(this.nextBallLevel);
    }

    this.canvas.addEventListener("pointerdown", this.shoot);
    window.addEventListener("pagehide", this.saveSnapshot);
  }

  getFriction() {
    const distanceToTop = this.cannon.y - RADIUS;
    const distanceToCenter = GAME_HEIGHT / 2 - RADIUS;
    const targetDistance = distanceToTop + distanceToCenter;
    return INITIAL_SPEED ** 2 / (targetDistance * 2);
  }

  updateStats() {
    this.statsDom.score.textContent = this.score;
    this.statsDom.last.textContent = this.last;
    this.statsDom.best.textContent = getBestScore();
  }

  updateFlyingBall(deltaTime) {
    const ball = this.balls.at(-1);
    ball.setPosition(deltaTime);
    if (ball.isOutOfBounds(GAME_HEIGHT)) return this.gameOver();
    const isBounced = ball.bounce(GAME_WIDTH);
    if (isBounced) playSound("bounce");

    const hitBall = ball.bounceFromOthers(this.balls);
    if (hitBall) {
      this.score += 1;
      this.updateStats();
      const isDestroyed = hitBall.hit();
      playSound(isDestroyed ? "destroy" : "hit");
      if (isDestroyed) this.balls.splice(this.balls.indexOf(hitBall), 1);
    }

    ball.setVelocity(this.getFriction(), deltaTime);

    if (ball.isStopped()) {
      ball.vx = 0;
      ball.vy = 0;
      playSound("growStart");
      this.state = "growing";
    }
  }

  updateGrowingBall(deltaTime) {
    const ball = this.balls.at(-1);
    const maxRadius = ball.getMaxRadius(this.balls, GAME_WIDTH, GAME_HEIGHT, this.cannon);
    if (maxRadius === null) {
      this.balls.pop();
      this.state = "aiming";
      playSound("cannonZone");
      return;
    }

    const finished = ball.grow(deltaTime, maxRadius);
    if (finished) {
      playSound("growEnd");
      this.state = "aiming";
    }
  }

  update(deltaTime) {
    if (this.paused) return;

    if (this.state === "aiming") this.cannon.update(deltaTime);
    else if (this.state === "flying") this.updateFlyingBall(deltaTime);
    else if (this.state === "growing") this.updateGrowingBall(deltaTime);
  }

  gameOver() {
    playSound("gameOver");
    addRecord(this.score);
    this.last = this.score;
    this.reset();
  }

  reset() {
    this.balls = [];
    this.state = "aiming";
    this.score = 0;
    this.updateStats();
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
    this.score += 1;
    playSound("shoot");
    this.updateStats();

    this.nextBallLevel = randomBallLevel();
    this.cannon.setNextBall(this.nextBallLevel);
  };

  start() {
    requestAnimationFrame(this.loop);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  saveSnapshot = () => {
    if (this.score === 0) {
      removeValue("game-state");
      return;
    }

    writeValue("game-state", {
      score: this.score,
      state: this.state,
      nextBallLevel: this.nextBallLevel,
      balls: this.balls.map((ball) => ball.toSnapshot())
    });
  };

  restoreSnapshot() {
    const snapshot = readValue("game-state", null);
    if (!snapshot) return false;

    this.score = snapshot.score;
    this.state = snapshot.state;
    this.nextBallLevel = snapshot.nextBallLevel;
    this.balls = snapshot.balls.map((data) => Ball.fromSnapshot(this.ctx, data));

    this.cannon.setNextBall(this.nextBallLevel);

    removeValue("game-state");
    this.updateStats();

    return true;
  }

  loop = (time) => {
    const deltaTime = (time - this.previousTime) / 1000;
    this.previousTime = time;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.loop);
  };
}
