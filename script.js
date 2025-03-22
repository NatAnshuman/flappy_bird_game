const bird = document.getElementById("bird");
const game = document.getElementById("game");
const obstacles = document.getElementById("obstacles");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const finalScore = document.getElementById("final-score");
const bestScore = document.getElementById("best-score");
const crashSound = document.getElementById("crash-sound"); // Crash sound element

let birdTop = 250;
let birdVelocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;
let best = 0; // Track the best score
let gameInterval;
let obstacleInterval;

// Start the game
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  game.style.display = "block";
  startGame();
});

// Restart the game
restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  game.style.display = "block";
  startGame();
});

function startGame() {
  // Reset game state
  isGameOver = false;
  birdTop = 250;
  birdVelocity = 0;
  score = 0;
  obstacles.innerHTML = "";
  bird.style.top = birdTop + "px";

  // Start game loops
  applyGravity();
  gameInterval = setInterval(createObstacle, 2000);
}

// Make the bird fall
function applyGravity() {
  if (isGameOver) return;
  birdVelocity += gravity;
  birdTop += birdVelocity;
  bird.style.top = birdTop + "px";

  // Check for game over (bird hits the ground or flies too high)
  if (birdTop > 560 || birdTop < 0) {
    gameOver();
  }

  requestAnimationFrame(applyGravity);
}

// Make the bird jump
function jump() {
  if (isGameOver) return;
  birdVelocity = -6; // Adjust jump strength
}
document.addEventListener("click", jump); // Mouse click for desktop
document.addEventListener("touchstart", jump); // Touch for mobile

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

function createObstacle() {
  if (isGameOver) return;
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  const minGap = 150; // Minimum gap between poles
  const maxGap = 230; // Maximum gap between poles
  const gap = Math.random() * (maxGap - minGap) + minGap; // Randomize gap size
  const maxGapPosition = 600 - gap; // Maximum vertical position for the gap
  const gapPosition = Math.random() * maxGapPosition; // Randomize gap position

  // Fixed pole height (same for both poles)
  const poleHeight = 400; // Set a fixed height for both poles

  // Top obstacle
  const topObstacle = obstacle.cloneNode();
  topObstacle.style.height = `${poleHeight}px`; // Fixed height for the top pole
  topObstacle.style.top = `${gapPosition - poleHeight}px`; // Position based on gap position
  topObstacle.style.backgroundImage = "url('https://iili.io/3oyssou.png')"; /* New upper pole image */
 
  obstacles.appendChild(topObstacle);

  // Bottom obstacle
  const bottomObstacle = obstacle.cloneNode();
  bottomObstacle.style.height = `${poleHeight}px`; // Fixed height for the bottom pole
  bottomObstacle.style.top = `${gapPosition + gap}px`; // Position based on gap position
  bottomObstacle.style.backgroundImage = "url('https://iili.io/3oysPte.png')"; /* New lower pole image */
  obstacles.appendChild(bottomObstacle);

  // Move obstacles
  let obstacleLeft = 400;
  function moveObstacle() {
    if (isGameOver) return;
    obstacleLeft -= 2;
    topObstacle.style.left = `${obstacleLeft}px`;
    bottomObstacle.style.left = `${obstacleLeft}px`;

    // Bird dimensions
    const birdBottom = birdTop + 40; // Bird height is 40px
    const birdRight = 50 + 40; // Bird's horizontal position (left + width)

    // Check for collision
    if (
      obstacleLeft < birdRight && // Pole is within the bird's horizontal range
      obstacleLeft + 60 > 50 && // Pole is not too far to the left
      (birdTop < gapPosition || birdBottom > gapPosition + gap) // Bird collides with top or bottom pole
    ) {
      gameOver();
    }

    // Increase score when obstacle passes
    if (obstacleLeft === 50) {
      score++;
    }

    if (obstacleLeft > -60) {
      requestAnimationFrame(moveObstacle);
    } else {
      obstacles.removeChild(topObstacle);
      obstacles.removeChild(bottomObstacle);
    }
  }
  moveObstacle();
}

// Game over function
function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);

  // Play crash sound
  crashSound.play();

  // Update best score
  if (score > best) {
    best = score;
    bestScore.textContent = best;
  }

  // Show game over screen
  game.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScore.textContent = score;
}

// Start the game on page load
startScreen.style.display = "block";
