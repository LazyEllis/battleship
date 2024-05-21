const gameMessage = document.querySelector(".game-message");
const rotateBtn = document.querySelector(".rotate-btn");
const playerGrid = document.querySelector(".player-grid");
const computerGrid = document.querySelector(".computer-grid");
const grids = document.querySelectorAll(".grid");
const gameOverModal = document.querySelector(".game-over-modal");
const gameOverMessage = document.querySelector(".game-over-message");

const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const clearGrid = (grid) => {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
};

const setShipMessage = (length) => {
  switch (length) {
    case 4:
      return "Place your Battleship";
    case 3:
      return "Place your Cruisers";
    case 2:
      return "Place your Destroyers";
    case 1:
      return "Place your Submarines";
    default:
      return "";
  }
};

const setCellType = (player, cell, value) => {
  if (player.name === "Player" && typeof value === "object") {
    cell.classList.add("ship");
  } else if (value === "miss") {
    cell.classList.add("miss");
  } else if (value === "hit") {
    cell.classList.add("hit");
  }
};

export const toggleGrids = () => {
  grids.forEach((grid) => {
    grid.classList.toggle("enabled");
  });
};

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

const showGameMessage = () => {
  const { index } = gameMessage.dataset;
  gameMessage.dataset.length = shipLengths[+index];
  const { length } = gameMessage.dataset;
  const message = setShipMessage(+length);
  gameMessage.textContent = message;
};

export const resetGameMessage = () => {
  gameMessage.dataset.index = 0;
  showGameMessage();
};

export const changeGameMessage = () => {
  const { index } = gameMessage.dataset;
  gameMessage.dataset.index = +index + 1;
  showGameMessage();
};

export const changeDirection = () => {
  const { direction } = rotateBtn.dataset;
  rotateBtn.dataset.direction =
    direction === "horizontal" ? "vertical" : "horizontal";
};

export const showGameOverModal = (message) => {
  gameOverMessage.textContent = message;
  gameOverModal.showModal();
};

export const highlightShip = (row, column, length, direction) => {
  const cellsToHighlight = [];
  let isValid = true;

  for (let i = 0; i < length; i += 1) {
    let cell;

    if (direction === "horizontal") {
      cell = playerGrid.querySelector(
        `[data-row="${+row}"][data-column="${+column + i}"]`
      );
    } else {
      cell = playerGrid.querySelector(
        `[data-row="${+row + i}"][data-column="${+column}"]`
      );
    }

    if (!cell || cell.classList.contains("ship")) {
      isValid = false;
      break;
    }

    cellsToHighlight.push(cell);
  }

  if (isValid) {
    cellsToHighlight.forEach((cell) => cell.classList.add("preview"));
  }
};

export const removePreview = () => {
  const previews = document.querySelectorAll(".preview");
  previews.forEach((preview) => preview.classList.remove("preview"));
};

export const hideGameOverModal = () => {
  gameOverModal.close();
};
