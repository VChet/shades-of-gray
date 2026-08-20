export function createMenu(game) {
  const menuButton = document.querySelector("#menu");
  const menuDialog = document.querySelector("#menu-dialog");
  const closeMenuButton = document.querySelector("#close");
  const newGameButton = document.querySelector("#new-game");

  menuButton.addEventListener("click", () => {
    game.pause();
    menuDialog.showModal();
  });

  closeMenuButton.addEventListener("click", () => { menuDialog.close(); });

  menuDialog.addEventListener("close", () => { game.resume(); });

  newGameButton.addEventListener("click", () => {
    game.reset();
    menuDialog.close();
  });
}
