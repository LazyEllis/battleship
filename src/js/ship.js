class Ship {
  #length;

  #hits = 0;

  constructor(length) {
    this.#length = Math.max(length, 1);
  }

  get length() {
    return this.#length;
  }

  hit() {
    if (!this.isSunk()) {
      this.#hits += 1;
    }
  }

  isSunk() {
    return this.#length === this.#hits;
  }
}

export default Ship;
