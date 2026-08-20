import { zzfx } from "zzfx";
import { readValue, writeValue } from "./helpers/storage.js";

const STORAGE_KEY = "sound";
let enabled = readValue(STORAGE_KEY, true);

export function isSoundEnabled() {
  return enabled;
}

export function toggleSound() {
  enabled = !enabled;
  writeValue(STORAGE_KEY, enabled);
}

const VOLUME = 0.5;
const sounds = {
  shoot: [VOLUME, 0.05, 180, 0, 0.02, 0.12, 1],
  bounce: [VOLUME, 0.08, 220, 0, 0.01, 0.06, 1],
  hit: [VOLUME, 0.1, 200, 0, 0.01, 0.08, 1],
  destroy: [VOLUME, 0.05, 120, 0, 0.02, 0.15],
  growStart: [VOLUME, 0.05, 140, 0, 0.05, 0.12],
  growEnd: [VOLUME, 0.05, 320, 0, 0.03, 0.1],
  cannonZone: [VOLUME, 0.08, 140, 0, 0.01, 0.12, 1],
  gameOver: [VOLUME, 0, 200, 0, 0.1, 0.5]
};

export function playSound(name) {
  if (!enabled) return;
  zzfx(...sounds[name]);
}
