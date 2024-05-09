import Ship from "../src/js/ship";

let ship;

describe("Ship", () => {
  beforeEach(() => {
    ship = new Ship(3);
  });

  test("has a valid positive integer length", () => {
    expect(ship.length).toBeGreaterThan(0);
    expect(Number.isInteger(ship.length)).toBe(true);
  });

  test("zero length ship defaults to length 1", () => {
    ship = new Ship(0);
    expect(ship.length).toBe(1);
  });

  test("negative length ship defaults to length 1", () => {
    ship = new Ship(-1);
    expect(ship.length).toBe(1);
  });

  test("should not be sunk when created", () => {
    expect(ship.isSunk()).toBe(false);
  });

  test("sinks when hit as many times as its length", () => {
    for (let i = 0; i < ship.length; i += 1) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  });

  test("remains afloat if not hit enough times to sink", () => {
    for (let i = 0; i < ship.length - 1; i += 1) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(false);
  });

  test("should not register hits after sinking", () => {
    for (let i = 0; i < ship.length; i += 1) {
      ship.hit();
    }
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
