import "../style.scss";
import Ship from "./ship";
import Gameboard from "./gameboard";
import Player from "./player";
import {
  renderGrid,
  changeDirection,
  changeGameMessage,
  highlightShip,
  resetGameMessage,
  removePreview,
  showGameOverModal,
  hideGameOverModal,
  toggleGrids,
} from "./dom";

const gameMessage = document.querySelector(".game-message");
const computerGrid = document.querySelector(".computer-grid");
const playerGrid = document.querySelector(".player-grid");
const rotateBtn = document.querySelector(".rotate-btn");
const restartBtn = document.querySelector(".restart-btn");

const humanPlayer = new Player("Player", new Gameboard());
const computerPlayer = new Player("Computer", new Gameboard());

/**
 * Generate a random coordinate within the grid.
 * @return {Array<number>} The [row, col] coordinate.
 */
const generateRandomCoordinate = () => [
  Math.floor(Math.random() * 10),
  Math.floor(Math.random() * 10),
];

/**
 * Generate a random ship orientation.
 * @return {string} The ship orientation ('horizontal' or 'vertical').
 */
const generateRandomOrientation = () =>
  Math.random() < 0.5 ? "horizontal" : "vertical";

/**
 * Check if a cell has been hit.
 * @param {Player} player - The player.
 * @param {Array<number>} coordinate - The [row, col] coordinate.
 * @return {boolean} True if the cell has been hit, otherwise false.
 */
const isCellHit = (player, [row, col]) =>
  player.gameboard.grid[row][col] === "hit";

/**
 * Check if a cell has been missed.
 * @param {Player} player - The player.
 * @param {Array<number>} coordinate - The [row, col] coordinate.
 * @return {boolean} True if the cell has been missed, otherwise false.
 */
const isCellMissed = (player, [row, col]) =>
  player.gameboard.grid[row][col] === "miss";

/**
 * Generate a random valid coordinate that has not been hit or missed.
 * @param {Player} player - The player.
 * @return {Array<number>} The valid [row, col] coordinate.
 */
const generateRandomValidCoordinate = (player) => {
  let coordinate;
  do {
    coordinate = generateRandomCoordinate();
  } while (isCellHit(player, coordinate) || isCellMissed(player, coordinate));
  return coordinate;
};

/**
 * Render the grids for both players.
 */
const renderGrids = () => {
  renderGrid(humanPlayer);
  renderGrid(computerPlayer);
};

/**
 * Place a random ship on the player's gameboard.
 * @param {Ship} ship - The ship to place.
 * @param {Player} player - The player.
 */
const placeRandomShip = (ship, player) => {
  let placed = false;
  while (!placed) {
    try {
      const coordinate = generateRandomCoordinate();
      const direction = generateRandomOrientation();
      player.gameboard.placeShip(ship, coordinate, direction);
      placed = true;
    } catch {
      // Retry placement
    }
  }
};

/**
 * Place ships on the computer's gameboard.
 */
const placeComputerShips = () => {
  const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  shipLengths.forEach((length) => {
    const ship = new Ship(length);
    placeRandomShip(ship, computerPlayer);
  });
};

/**
 * Start the game by rendering the grids and placing the computer's ships.
 */
const startGame = () => {
  renderGrids();
  toggleGrids();
  placeComputerShips();
};

/**
 * Preview the ship placement on mouseover.
 * @param {Event} e - The mouseover event.
 */
const previewShip = (e) => {
  if (
    e.target.classList.contains("ship") ||
    !e.target.parentNode.classList.contains("enabled")
  ) {
    return;
  }

  if (e.target.classList.contains("cell")) {
    const { row, column } = e.target.dataset;
    const { length } = gameMessage.dataset;
    const { direction } = rotateBtn.dataset;
    highlightShip(+row, +column, +length, direction);
  }
};

/**
 * Place the player's ship on click.
 * @param {Event} e - The click event.
 */
const placePlayerShip = (e) => {
  if (
    e.target.classList.contains("ship") ||
    !e.target.parentNode.classList.contains("enabled")
  ) {
    return;
  }

  if (e.target.classList.contains("cell")) {
    const { length } = gameMessage.dataset;
    const ship = new Ship(+length);
    const coordinate = [+e.target.dataset.row, +e.target.dataset.column];
    const { direction } = rotateBtn.dataset;

    try {
      humanPlayer.gameboard.placeShip(ship, coordinate, direction);
    } catch {
      return;
    }

    renderGrids();
    changeGameMessage();
    if (gameMessage.textContent === "") startGame();
  }
};

/**
 * Change the game status by registering an attack.
 * @param {Player} player - The player being attacked.
 * @param {Array<number>} coordinate - The [row, col] coordinate of the attack.
 */
const changeGameStatus = (player, coordinate) => {
  player.gameboard.receiveAttack(coordinate);
  renderGrids();
};

/**
 * Check if the game is over.
 * @return {boolean} True if the game is over, otherwise false.
 */
const isGameOver = () => {
  if (humanPlayer.gameboard.isAllSunk()) {
    showGameOverModal("You Lose!");
  } else if (computerPlayer.gameboard.isAllSunk()) {
    showGameOverModal("You Win!");
  } else {
    return false;
  }
  toggleGrids();
  return true;
};

/**
 * Simulate the computer hitting the player's cells.
 */
const hitPlayerCell = () => {
  let landedHit = true;

  while (landedHit) {
    const coordinate = generateRandomValidCoordinate(humanPlayer);
    changeGameStatus(humanPlayer, coordinate);
    if (isGameOver()) return;
    if (isCellMissed(humanPlayer, coordinate)) landedHit = false;
  }
};

/**
 * Handle the player's attack on the computer's cells.
 * @param {Event} e - The click event.
 */
const hitComputerCell = (e) => {
  if (!e.target.parentNode.classList.contains("enabled")) return;

  if (
    e.target.classList.contains("cell") &&
    !e.target.classList.contains("miss") &&
    !e.target.classList.contains("hit")
  ) {
    const { row, column } = e.target.dataset;
    const coordinate = [parseInt(row, 10), parseInt(column, 10)];
    changeGameStatus(computerPlayer, coordinate);
    if (isGameOver()) return;
    if (isCellMissed(computerPlayer, coordinate)) hitPlayerCell();
  }
};

/**
 * Restart the game by resetting the gameboards and messages.
 */
const restartGame = () => {
  resetGameMessage();
  humanPlayer.gameboard = new Gameboard();
  computerPlayer.gameboard = new Gameboard();
  hideGameOverModal();
  renderGrids();
};

// Event listeners
rotateBtn.addEventListener("click", changeDirection);
playerGrid.addEventListener("click", placePlayerShip);
playerGrid.addEventListener("mouseover", previewShip);
playerGrid.addEventListener("mouseout", removePreview);
computerGrid.addEventListener("click", hitComputerCell);
restartBtn.addEventListener("click", restartGame);

renderGrids();
resetGameMessage();
