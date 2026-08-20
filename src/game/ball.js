import { getBallColor } from "./helpers/color.js";

const GROWTH_SPEED = 100;

export class Ball {
  constructor(ctx, x, y, angle, speed, radius, level) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.vx = Math.sin(angle) * speed;
    this.vy = -Math.cos(angle) * speed;
    this.radius = radius;
    this.level = level;
  }

  render() {
    const { ctx } = this;
    const color = getBallColor(this.level);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  setPosition(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  bounce(width) {
    if (this.x - this.radius <= 0) {
      this.x = this.radius;
      this.vx = Math.abs(this.vx);
    }

    if (this.x + this.radius >= width) {
      this.x = width - this.radius;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y - this.radius <= 0) {
      this.y = this.radius;
      this.vy = Math.abs(this.vy);
    }
  }

  isOutOfBounds(height) {
    return this.y + this.radius >= height;
  }

  isStopped(threshold = 0.01) {
    return Math.hypot(this.vx, this.vy) < threshold;
  }

  getMaxRadius(balls, width, height, cannon) {
    const left = this.x;
    const right = width - this.x;
    const top = this.y;
    const bottom = height - this.y;

    const distanceToCannon = Math.hypot(this.x - cannon.x, this.y - cannon.y);
    const cannonDistance = distanceToCannon - cannon.getSafeRadius();

    let otherBallDistance = Infinity;

    for (const otherBall of balls) {
      // Ignore collision with itself
      if (otherBall === this) continue;
      // Get the distance between the two
      const dx = this.x - otherBall.x;
      const dy = this.y - otherBall.y;
      const distance = Math.hypot(dx, dy);
      const maxRadius = distance - otherBall.radius;
      otherBallDistance = Math.min(otherBallDistance, maxRadius);
    }

    const maxRadius = Math.min(left, right, top, bottom, cannonDistance, otherBallDistance);
    return maxRadius > 0 ? maxRadius : null;
  }

  bounceFromOthers(balls) {
    for (const otherBall of balls) {
      // Ignore collision with itself
      if (otherBall === this) continue;
      // Get the distance between the two
      const dx = this.x - otherBall.x;
      const dy = this.y - otherBall.y;
      const distance = Math.hypot(dx, dy);
      // Balls collide when the distance between them is less than the sum of their radii
      const minDistance = this.radius + otherBall.radius;
      if (distance >= minDistance) continue;
      // Get the normal vector
      const nx = dx / distance;
      const ny = dy / distance;
      // Calculate the velocity along the normal
      const velocityAlongNormal = this.vx * nx + this.vy * ny;
      // If the velocity along the normal is positive, the balls are moving away from each other
      if (velocityAlongNormal >= 0) continue;
      // Reverse the direction of the current ball
      this.vx -= 2 * velocityAlongNormal * nx;
      this.vy -= 2 * velocityAlongNormal * ny;

      return otherBall;
    }
    return null;
  }

  setVelocity(friction, deltaTime) {
    const speed = Math.hypot(this.vx, this.vy);
    if (speed === 0) return;

    const newSpeed = Math.max(0, speed - friction * deltaTime);
    const factor = newSpeed / speed;

    this.vx *= factor;
    this.vy *= factor;
  }

  grow(deltaTime, maxRadius) {
    this.radius = Math.min(
      this.radius + GROWTH_SPEED * deltaTime,
      maxRadius
    );

    return this.radius >= maxRadius;
  }

  hit() {
    if (this.level === 0) return true;

    this.level -= 1;
    return false;
  }
}
