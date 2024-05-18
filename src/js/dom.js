import { clearGrid, setCellType } from "./utils";

const playerGrid = document.querySelector(".player-grid");
const computerGrid = document.querySelector(".computer-grid");
const gameOverModal = document.querySelector(".game-over-modal");
const gameOverMessage = document.querySelector(".game-over-message");

export const renderGrid = (player) => {
  const grid = player.name === "Player" ? playerGrid : computerGrid;
  clearGrid(grid);

  player.gameboard.grid.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = player.gameboard.grid.indexOf(row);
      cell.dataset.column = key;
      setCellType(player, cell, value);
      grid.appendChild(cell);
    });
  });
};

export const showGameOverModal = (message) => {
  gameOverMessage.textContent = message;
  gameOverModal.showModal();
};

export const hideGameOverModal = () => {
  gameOverModal.close();
};
