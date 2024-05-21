/**
 * Class representing a player.
 */
class Player {
  /**
   * Create a player.
   * @param {string} name - The name of the player.
   * @param {Gameboard} gameboard - The gameboard of the player.
   */
  constructor(name, gameboard) {
    this.name = name;
    this.gameboard = gameboard;
  }
}

export default Player;
