const shipOutOfBounds = (coordinate) => {
  if (
    coordinate[0] < 0 ||
    coordinate[0] > 9 ||
    coordinate[1] < 0 ||
    coordinate[1] > 9
  ) {
    throw new Error("Ships cannot be placed out of bounds");
  }
};

class Gameboard {
  constructor() {
    this.#createGrid();
  }

  #grid;

  #ships = [];

  get grid() {
    return this.#grid;
  }

  #createGrid() {
    this.#grid = [];

    for (let vertical = 0; vertical < 10; vertical += 1) {
      const row = [];

      for (let cell = 0; cell < 10; cell += 1) {
        row.push(undefined);
      }

      this.#grid.push(row);
    }
  }

  #shipOverlaps(coordinate) {
    if (this.#grid[coordinate[0]][coordinate[1]] !== undefined)
      throw new Error("Ships cannot overlap");
  }

  #shipTouches(coordinate) {
    const adjacentCoordinates = [
      [coordinate[0] - 1, coordinate[1]],
      [coordinate[0] + 1, coordinate[1]],
      [coordinate[0], coordinate[1] - 1],
      [coordinate[0], coordinate[1] + 1],
      [coordinate[0] - 1, coordinate[1] - 1],
      [coordinate[0] - 1, coordinate[1] + 1],
      [coordinate[0] + 1, coordinate[1] - 1],
      [coordinate[0] + 1, coordinate[1] + 1],
    ];

    adjacentCoordinates.forEach((adjacentCoordinate) => {
      if (
        adjacentCoordinate[0] >= 0 &&
        adjacentCoordinate[0] <= 9 &&
        adjacentCoordinate[1] >= 0 &&
        adjacentCoordinate[1] <= 9 &&
        this.#grid[adjacentCoordinate[0]][adjacentCoordinate[1]] !== undefined
      ) {
        throw new Error("Ships cannot touch each other");
      }
    });
  }

  #positionIsValid(ship, coordinate, direction) {
    if (ship.length === 1) {
      shipOutOfBounds(coordinate);
      this.#shipOverlaps(coordinate);
      this.#shipTouches(coordinate);
      return;
    }

    for (let index = 0; index < ship.length; index += 1) {
      if (direction === "horizontal") {
        shipOutOfBounds([coordinate[0], coordinate[1] + index]);
        this.#shipOverlaps([coordinate[0], coordinate[1] + index]);
        this.#shipTouches([coordinate[0], coordinate[1] + index]);
      } else if (direction === "vertical") {
        shipOutOfBounds([coordinate[0] + index, coordinate[1]]);
        this.#shipOverlaps([coordinate[0] + index, coordinate[1]]);
        this.#shipTouches([coordinate[0] + index, coordinate[1]]);
      }
    }
  }

  placeShip(ship, coordinate, direction = null) {
    this.#positionIsValid(ship, coordinate, direction);
    this.#ships.push(ship);

    if (ship.length === 1) {
      this.#grid[coordinate[0]][coordinate[1]] = ship;
      return;
    }

    for (let index = 0; index < ship.length; index += 1) {
      if (direction === "horizontal") {
        this.#grid[coordinate[0]][coordinate[1] + index] = ship;
      } else if (direction === "vertical") {
        this.#grid[coordinate[0] + index][coordinate[1]] = ship;
      }
    }
  }

  receiveAttack(coordinate) {
    if (this.#grid[coordinate[0]][coordinate[1]]) {
      this.#grid[coordinate[0]][coordinate[1]].hit();
      this.#grid[coordinate[0]][coordinate[1]] = "hit";
    } else {
      this.#grid[coordinate[0]][coordinate[1]] = "miss";
    }
  }

  isAllSunk() {
    return this.#ships.every((ship) => ship.isSunk());
  }
}

export default Gameboard;
