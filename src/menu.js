import { renderLeaderboard } from "./game/leaderboard.js";
import { isSoundEnabled, toggleSound } from "./game/sound.js";

export function createMenu(game) {
  function setupDialog(dialogSelector) {
    const dialog = document.querySelector(dialogSelector);
    const closeButton = dialog.querySelector("[data-close]");
    closeButton?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("close", () => {
      if (!document.querySelector("dialog[open]")) game.resume();
    });

    return dialog;
  }

  const menuDialog = setupDialog("#menu-dialog");
  const leaderboardDialog = setupDialog("#leaderboard-dialog");

  // Main Menu
  const menuButton = document.querySelector("#menu");
  menuButton.addEventListener("click", () => {
    game.pause();
    menuDialog.showModal();
  });

  const soundToggle = menuDialog.querySelector("#sound");
  soundToggle.checked = isSoundEnabled();
  soundToggle.addEventListener("change", () => { toggleSound(); });

  const newGameButton = menuDialog.querySelector("#new-game");
  newGameButton.addEventListener("click", () => {
    game.reset();
    menuDialog.close();
  });
  // Leaderboard
  const leaderboardButton = menuDialog.querySelector("#leaderboard");
  const leaderboardList = leaderboardDialog.querySelector("#leaderboard-list");

  leaderboardButton.addEventListener("click", () => {
    game.pause();
    menuDialog.close();
    renderLeaderboard(leaderboardList);
    leaderboardDialog.showModal();
  });
}
