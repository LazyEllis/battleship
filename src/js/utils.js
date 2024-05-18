export const clearGrid = (grid) => {
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
};

export const setCellType = (player, cell, value) => {
  if (player.name === "Player" && typeof value === "object") {
    cell.classList.add("ship");
  } else if (value === "miss") {
    cell.classList.add("miss");
  } else if (value === "hit") {
    cell.classList.add("hit");
  }
};

export const generateRandomCoordinate = () => {
  const row = Math.floor(Math.random() * 10);
  const column = Math.floor(Math.random() * 10);
  return [row, column];
};

export const generateRandomOrientation = () =>
  Math.random() < 0.5 ? "horizontal" : "vertical";

const isCellHit = (player, coordinate) =>
  player.gameboard.grid[coordinate[0]][coordinate[1]] === "hit";

export const isCellMissed = (player, coordinate) =>
  player.gameboard.grid[coordinate[0]][coordinate[1]] === "miss";

export const generateRandomValidCoordinate = (player) => {
  let coordinate = generateRandomCoordinate();

  while (isCellHit(player, coordinate) || isCellMissed(player, coordinate))
    coordinate = generateRandomCoordinate();

  return coordinate;
};
