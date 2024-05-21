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

const generateRandomCoordinate = () => [
  Math.floor(Math.random() * 10),
  Math.floor(Math.random() * 10),
];

const generateRandomOrientation = () =>
  Math.random() < 0.5 ? "horizontal" : "vertical";

const isCellHit = (player, [row, col]) =>
  player.gameboard.grid[row][col] === "hit";

const isCellMissed = (player, [row, col]) =>
  player.gameboard.grid[row][col] === "miss";

const generateRandomValidCoordinate = (player) => {
  let coordinate;
  do {
    coordinate = generateRandomCoordinate();
  } while (isCellHit(player, coordinate) || isCellMissed(player, coordinate));
  return coordinate;
};

const renderGrids = () => {
  renderGrid(humanPlayer);
  renderGrid(computerPlayer);
};

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

const placeComputerShips = () => {
  const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  shipLengths.forEach((length) => {
    const ship = new Ship(length);
    placeRandomShip(ship, computerPlayer);
  });
};

const startGame = () => {
  renderGrids();
  toggleGrids();
  placeComputerShips();
};

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

const changeGameStatus = (player, coordinate) => {
  player.gameboard.receiveAttack(coordinate);
  renderGrids();
};

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

const hitPlayerCell = () => {
  let landedHit = true;

  while (landedHit) {
    const coordinate = generateRandomValidCoordinate(humanPlayer);
    changeGameStatus(humanPlayer, coordinate);
    if (isGameOver()) return;
    if (isCellMissed(humanPlayer, coordinate)) landedHit = false;
  }
};

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

const restartGame = () => {
  resetGameMessage();
  humanPlayer.gameboard = new Gameboard();
  computerPlayer.gameboard = new Gameboard();
  hideGameOverModal();
  renderGrids();
};

rotateBtn.addEventListener("click", changeDirection);
playerGrid.addEventListener("click", placePlayerShip);
playerGrid.addEventListener("mouseover", previewShip);
playerGrid.addEventListener("mouseout", removePreview);
computerGrid.addEventListener("click", hitComputerCell);
restartBtn.addEventListener("click", restartGame);

renderGrids();
resetGameMessage();
