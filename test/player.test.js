import Player from "../src/js/player";

let player;
const board = { grid: [] };

describe("Player", () => {
  beforeEach(() => {
    player = new Player("John", board);
  });

  test("has a name", () => {
    expect(player.name).toBe("John");
  });

  test("has a gameboard", () => {
    expect(player.gameboard).toBeDefined();
  });
});
