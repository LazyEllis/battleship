const gameMessage = document.querySelector(".game-message");
const rotateBtn = document.querySelector(".rotate-btn");
const playerGrid = document.querySelector(".player-grid");
const computerGrid = document.querySelector(".computer-grid");
const grids = document.querySelectorAll(".grid");
const gameOverModal = document.querySelector(".game-over-modal");
const gameOverMessage = document.querySelector(".game-over-message");

const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

/**
 * Clear all cells in the given grid.
 * @param {HTMLElement} grid - The grid to clear.
 */
const clearGrid = (grid) => {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
};

/**
 * Get the ship placement message based on the ship length.
 * @param {number} length - The length of the ship.
 * @return {string} The ship placement message.
 */
const setShipMessage = (length) => {
  const messages = {
    4: "Place your Battleship",
    3: "Place your Cruisers",
    2: "Place your Destroyers",
    1: "Place your Submarines",
  };
  return messages[length] || "";
};

/**
 * Set the cell type based on the player's ship and attack status.
 * @param {Player} player - The player.
 * @param {HTMLElement} cell - The cell element.
 * @param {*} value - The value to set.
 */
const setCellType = (player, cell, value) => {
  if (player.name === "Player" && typeof value === "object" && value !== null) {
    cell.classList.add("ship");
  } else if (value === "miss") {
    cell.classList.add("miss");
  } else if (value === "hit") {
    cell.classList.add("hit");
  }
};

/**
 * Toggle the enabled class on all grids.
 */
export const toggleGrids = () => {
  grids.forEach((grid) => grid.classList.toggle("enabled"));
};

/**
 * Render the gameboard grid for a player.
 * @param {Player} player - The player whose grid to render.
 */
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

/**
 * Show the game message for placing ships.
 */
const showGameMessage = () => {
  const { index } = gameMessage.dataset;
  gameMessage.dataset.length = shipLengths[+index];
  const { length } = gameMessage.dataset;
  gameMessage.textContent = setShipMessage(+length);
};

/**
 * Reset the game message to the initial state.
 */
export const resetGameMessage = () => {
  gameMessage.dataset.index = 0;
  showGameMessage();
};

/**
 * Change the game message to the next ship to place.
 */
export const changeGameMessage = () => {
  const { index } = gameMessage.dataset;
  gameMessage.dataset.index = +index + 1;
  showGameMessage();
};

/**
 * Change the ship placement direction.
 */
export const changeDirection = () => {
  rotateBtn.dataset.direction =
    rotateBtn.dataset.direction === "horizontal" ? "vertical" : "horizontal";
};

/**
 * Show the game over modal with a message.
 * @param {string} message - The game over message.
 */
export const showGameOverModal = (message) => {
  gameOverMessage.textContent = message;
  gameOverModal.showModal();
};

/**
 * Check if there are adjacent ships to the given cell.
 * @param {number} row - The row of the cell.
 * @param {number} col - The column of the cell.
 * @return {boolean} True if there are adjacent ships, otherwise false.
 */
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

/**
 * Highlight the cells for ship placement preview.
 * @param {number} row - The starting row.
 * @param {number} column - The starting column.
 * @param {number} length - The length of the ship.
 * @param {string} direction - The direction of the ship ('horizontal' or 'vertical').
 */
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

/**
 * Remove the preview class from all previewed cells.
 */
export const removePreview = () => {
  document
    .querySelectorAll(".preview")
    .forEach((preview) => preview.classList.remove("preview"));
};

/**
 * Hide the game over modal.
 */
export const hideGameOverModal = () => {
  gameOverModal.close();
};
