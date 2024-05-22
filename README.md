# Battleship Game

Welcome to the Battleship Game! This project is a web-based implementation of the classic Battleship game, where you can play against a computer opponent. The game is built using HTML, SCSS, and JavaScript (ES6 modules).

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Responsive Design**: The game layout adjusts to different screen sizes.
- **Interactive Gameplay**: Place your ships and attack the computer's grid.
- **Randomized AI**: The computer places its ships and attacks randomly.
- **SCSS Styling**: Modern styling with SCSS.

## Setup

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/LazyEllis/battleship.git
   cd battleship-game
   ```

2. **Install dependencies**:
   Make sure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. Open `index.html` on your browser to play the game.

## Usage

### Playing the Game

1. **Placing Ships**:

   - Start by placing your ships on the grid.
   - Click on a cell to place the ship.
   - Use the "ROTATE" button to change the ship's orientation between horizontal and vertical.

2. **Attacking**:

   - Once all ships are placed, the game starts.
   - Click on the cells in the computer's grid to attack.

3. **Game Over**:
   - The game ends when all ships of either player are sunk.
   - A modal will appear showing whether you won or lost.
   - Click "NEW GAME" to restart.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or create a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -am 'Add my feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
