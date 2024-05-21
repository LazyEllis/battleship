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
  const messages = {
    4: "Place your Battleship",
    3: "Place your Cruisers",
    2: "Place your Destroyers",
    1: "Place your Submarines",
  };
  return messages[length] || "";
};

const setCellType = (player, cell, value) => {
  if (player.name === "Player" && typeof value === "object" && value !== null) {
    cell.classList.add("ship");
  } else if (value === "miss") {
    cell.classList.add("miss");
  } else if (value === "hit") {
    cell.classList.add("hit");
  }
};

export const toggleGrids = () => {
  grids.forEach((grid) => grid.classList.toggle("enabled"));
};

export const renderGrid = (player) => {
  const grid = player.name === "Player" ? playerGrid : computerGrid;
  clearGrid(grid);

  player.gameboard.grid.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = rowIndex;
      cell.dataset.column = colIndex;
      setCellType(player, cell, value);
      grid.appendChild(cell);
    });
  });
};

const showGameMessage = () => {
  const { index } = gameMessage.dataset;
  gameMessage.dataset.length = shipLengths[+index];
  const { length } = gameMessage.dataset;
  gameMessage.textContent = setShipMessage(+length);
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
  rotateBtn.dataset.direction =
    rotateBtn.dataset.direction === "horizontal" ? "vertical" : "horizontal";
};

export const showGameOverModal = (message) => {
  gameOverMessage.textContent = message;
  gameOverModal.showModal();
};

const hasAdjacentShips = (row, col) => {
  const adjacentOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return adjacentOffsets.some(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    const cell = playerGrid.querySelector(
      `[data-row="${r}"][data-column="${c}"]`
    );
    return cell && cell.classList.contains("ship");
  });
};

export const highlightShip = (row, column, length, direction) => {
  const cellsToHighlight = [];
  let isValid = true;

  for (let i = 0; i < length; i += 1) {
    const r = direction === "horizontal" ? row : row + i;
    const c = direction === "horizontal" ? column + i : column;

    const cell = playerGrid.querySelector(
      `[data-row="${r}"][data-column="${c}"]`
    );

    if (!cell || cell.classList.contains("ship") || hasAdjacentShips(r, c)) {
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
  document
    .querySelectorAll(".preview")
    .forEach((preview) => preview.classList.remove("preview"));
};

export const hideGameOverModal = () => {
  gameOverModal.close();
};
