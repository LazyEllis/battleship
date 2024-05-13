import Gameboard from "../src/js/gameboard";

const hit = jest.fn();
const isSunk = jest.fn();
let gameboard;
let singleShip;
let doubleShip;

describe("Gameboard", () => {
  beforeEach(() => {
    gameboard = new Gameboard();
    singleShip = { length: 1, hit, isSunk };
    doubleShip = { length: 2, hit, isSunk };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("has a 10x10 grid", () => {
    expect(gameboard.grid.length).toBe(10);
    expect(gameboard.grid[0].length).toBe(10);
  });

  test("places single-length ships on specified coordinates", () => {
    gameboard.placeShip(singleShip, [4, 4]);
    expect(gameboard.grid[4][4]).toBe(singleShip);
  });

  test("places multi-length ships horizontally", () => {
    gameboard.placeShip(doubleShip, [4, 4], "horizontal");
    expect(gameboard.grid[4][4]).toBe(doubleShip);
    expect(gameboard.grid[4][5]).toBe(doubleShip);
  });

  test("places multi-length ships vertically", () => {
    gameboard.placeShip(doubleShip, [4, 4], "vertical");
    expect(gameboard.grid[4][4]).toBe(doubleShip);
    expect(gameboard.grid[5][4]).toBe(doubleShip);
  });

  test("throws an error when ships overlap", () => {
    gameboard.placeShip(singleShip, [4, 4]);
    expect(() => {
      gameboard.placeShip(doubleShip, [4, 4], "vertical");
    }).toThrow("Ships cannot overlap");
  });

  test("throws an error when ship is placed out of bounds", () => {
    expect(() => {
      gameboard.placeShip(singleShip, [10, 10]);
    }).toThrow("Ships cannot be placed out of bounds");
  });

  test("does not allow ships to be placed out of bounds horizontally", () => {
    expect(() => {
      gameboard.placeShip(doubleShip, [9, 9], "horizontal");
    }).toThrow("Ships cannot be placed out of bounds");
  });

  test("does not allow ships to be placed out of bounds vertically", () => {
    expect(() => {
      gameboard.placeShip(doubleShip, [9, 9], "vertical");
    }).toThrow("Ships cannot be placed out of bounds");
  });

  test("does not allow ships to touch each other horizontally", () => {
    gameboard.placeShip(singleShip, [4, 4]);
    expect(() => {
      gameboard.placeShip(singleShip, [4, 3], "horizontal");
    }).toThrow("Ships cannot touch each other");
    expect(() => {
      gameboard.placeShip(singleShip, [4, 5], "horizontal");
    }).toThrow("Ships cannot touch each other");
  });

  test("does not allow ships to touch each other vertically", () => {
    gameboard.placeShip(singleShip, [4, 4]);
    expect(() => {
      gameboard.placeShip(singleShip, [3, 4]);
    }).toThrow("Ships cannot touch each other");
    expect(() => {
      gameboard.placeShip(singleShip, [5, 4]);
    }).toThrow("Ships cannot touch each other");
  });

  test("does not allow ships to touch each other diagonally", () => {
    gameboard.placeShip(singleShip, [4, 4]);
    expect(() => {
      gameboard.placeShip(singleShip, [3, 3]);
    }).toThrow("Ships cannot touch each other");
    expect(() => {
      gameboard.placeShip(singleShip, [5, 5]);
    }).toThrow("Ships cannot touch each other");
    expect(() => {
      gameboard.placeShip(singleShip, [3, 5]);
    }).toThrow("Ships cannot touch each other");
    expect(() => {
      gameboard.placeShip(singleShip, [5, 3]);
    }).toThrow("Ships cannot touch each other");
  });

  test("registers a hit when receiving an attack", () => {
    gameboard.placeShip(singleShip, [0, 0]);
    gameboard.receiveAttack([0, 0]);
    expect(hit.mock.calls).toHaveLength(1);
    expect(gameboard.grid[0][0]).toBe("hit");
  });

  test("registers a miss when receiving an attack", () => {
    gameboard.placeShip(singleShip, [0, 0]);
    gameboard.receiveAttack([0, 1]);
    expect(hit.mock.calls).toHaveLength(0);
    expect(gameboard.grid[0][1]).toBe("miss");
  });

  test("checks if all ships are sunk", () => {
    gameboard.placeShip(singleShip, [0, 0]);
    gameboard.placeShip(doubleShip, [2, 2], "horizontal");
    gameboard.isAllSunk();
    expect(isSunk).toHaveBeenCalled();
  });
});
