/**
 * Initialize a 10x10 grid.
 * @return {Array<Array<null>>} The initialized grid.
 */
const initializeGrid = () =>
  Array.from({ length: 10 }, () => Array(10).fill(null));

/**
 * Class representing a gameboard.
 */
class Gameboard {
  constructor() {
    this.grid = initializeGrid();
    this.ships = [];
  }

  /**
   * Place a ship on the gameboard.
   * @param {Ship} ship - The ship to place.
   * @param {Array<number>} position - The [row, col] position to start placing the ship.
   * @param {string} direction - The direction to place the ship ('horizontal' or 'vertical').
   * @throws Will throw an error if the ship cannot be placed.
   */
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

  /**
   * Check if a ship can be placed at the given position and direction.
   * @param {Ship} ship - The ship to check.
   * @param {Array<number>} position - The [row, col] position to check.
   * @param {string} direction - The direction to check ('horizontal' or 'vertical').
   * @return {boolean} True if the ship can be placed, otherwise false.
   */
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

  /**
   * Check if there are any adjacent ships at the given position.
   * @param {number} row - The row to check.
   * @param {number} col - The column to check.
   * @return {boolean} True if there are adjacent ships, otherwise false.
   */
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

  /**
   * Register an attack at the given position.
   * @param {Array<number>} position - The [row, col] position to attack.
   */
  receiveAttack([row, col]) {
    const cell = this.grid[row][col];
    if (cell) {
      cell.hit();
      this.grid[row][col] = "hit";
    } else {
      this.grid[row][col] = "miss";
    }
  }

  /**
   * Check if all ships on the gameboard are sunk.
   * @return {boolean} True if all ships are sunk, otherwise false.
   */
  isAllSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
