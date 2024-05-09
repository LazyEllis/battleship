class Ship {
  constructor(length) {
    this.#length = length > 0 ? length : 1;
  }

  #length;

  #hits = 0;

  get length() {
    return this.#length;
  }

  hit() {
    if (this.isSunk()) return;
    this.#hits += 1;
  }

  isSunk() {
    return this.#length === this.#hits;
  }
}

export default Ship;
