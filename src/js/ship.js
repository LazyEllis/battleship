/**
 * Class representing a ship.
 */
class Ship {
  #length;

  #hits = 0;

  /**
   * Create a ship.
   * @param {number} length - The length of the ship.
   */
  constructor(length) {
    this.#length = Math.max(length, 1); // Ensure length is at least 1
  }

  /**
   * Get the length of the ship.
   * @return {number} The length of the ship.
   */
  get length() {
    return this.#length;
  }

  /**
   * Register a hit on the ship.
   */
  hit() {
    if (!this.isSunk()) {
      this.#hits += 1;
    }
  }

  /**
   * Check if the ship is sunk.
   * @return {boolean} True if the ship is sunk, otherwise false.
   */
  isSunk() {
    return this.#length === this.#hits;
  }
}

export default Ship;
