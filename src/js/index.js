import "../style.scss";
import Ship from "./ship";
import Gameboard from "./gameboard";
import Player from "./player";
import { renderGrid, showGameOverModal, hideGameOverModal } from "./dom";
import {
  generateRandomCoordinate,
  generateRandomOrientation,
  generateRandomValidCoordinate,
  isCellMissed,
} from "./utils";

const computerGrid = document.querySelector(".computer-grid");
const restartBtn = document.querySelector(".restart-btn");

const humanPlayer = new Player("Player", new Gameboard());
const computerPlayer = new Player("Computer", new Gameboard());

const placeRandomShip = (ship, player) => {
  let placed = false;

  while (!placed) {
    try {
      const coordinate = generateRandomCoordinate();
      const orientation = generateRandomOrientation();
      player.gameboard.placeShip(ship, coordinate, orientation);
      placed = true;
    } catch (error) {
      // Error caught. This block intentionally left empty to retry placing the ship.
    }
  }
};

const placeShipsOverLengths = (player, shipLengths) => {
  shipLengths.forEach((length) => {
    const ship = new Ship(length);
    placeRandomShip(ship, player);
  });
};

const placeRandomShips = () => {
  const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  placeShipsOverLengths(computerPlayer, shipLengths);
  placeShipsOverLengths(humanPlayer, shipLengths);
};

const renderGrids = () => {
  renderGrid(humanPlayer);
  renderGrid(computerPlayer);
};

const restartGame = () => {
  humanPlayer.gameboard = new Gameboard();
  computerPlayer.gameboard = new Gameboard();
  hideGameOverModal();
  placeRandomShips();
  renderGrids();
};

const changeGameStatus = (player, coordinate) => {
  player.gameboard.receiveAttack(coordinate);
  renderGrids();
};

const isGameOver = () => {
  if (humanPlayer.gameboard.isAllSunk()) {
    showGameOverModal("You Lose!");
    return true;
  }

  if (computerPlayer.gameboard.isAllSunk()) {
    showGameOverModal("You Win!");
    return true;
  }

  return false;
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
  if (computerPlayer.gameboard.isAllSunk()) return;

  if (
    e.target.classList.contains("cell") &&
    !e.target.classList.contains("miss") &&
    !e.target.classList.contains("hit")
  ) {
    const cell = e.target;
    const { row, column } = cell.dataset;
    const coordinate = [row, column];
    changeGameStatus(computerPlayer, coordinate);
    if (isGameOver()) return;
    if (isCellMissed(computerPlayer, coordinate)) hitPlayerCell();
  }
};

computerGrid.addEventListener("click", hitComputerCell);
restartBtn.addEventListener("click", restartGame);

placeRandomShips();
renderGrids();
