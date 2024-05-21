const initializeGrid = () =>
  Array.from({ length: 10 }, () => Array(10).fill(null));
class Gameboard {
  constructor() {
    this.grid = initializeGrid();
    this.ships = [];
  }

  placeShip(ship, [row, col], direction) {
    if (this.#canPlaceShip(ship, [row, col], direction)) {
      for (let i = 0; i < ship.length; i += 1) {
        const [r, c] =
          direction === "horizontal" ? [row, col + i] : [row + i, col];
        this.grid[r][c] = ship;
      }
      this.ships.push(ship);
    } else {
      throw new Error("Invalid ship placement");
    }
  }

  #canPlaceShip(ship, [row, col], direction) {
    for (let i = 0; i < ship.length; i += 1) {
      const [r, c] =
        direction === "horizontal" ? [row, col + i] : [row + i, col];
      if (
        r >= 10 ||
        c >= 10 ||
        this.grid[r][c] ||
        this.#hasAdjacentShips(r, c)
      ) {
        return false;
      }
    }
    return true;
  }

  #hasAdjacentShips(row, col) {
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
      return r >= 0 && r < 10 && c >= 0 && c < 10 && this.grid[r][c];
    });
  }

  receiveAttack([row, col]) {
    const cell = this.grid[row][col];
    if (cell) {
      cell.hit();
      this.grid[row][col] = "hit";
    } else {
      this.grid[row][col] = "miss";
    }
  }

  isAllSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
