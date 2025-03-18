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
birdVelocity = -8; // Adjust jump strength
}

document.addEventListener("keydown", (e) => {
if (e.code === "Space") jump();
});

// Create obstacles
function createObstacle() {
if (isGameOver) return;
const obstacle = document.createElement("div");
obstacle.classList.add("obstacle");
const minGap = 150; // Minimum gap between poles
const maxGap = 200; // Maximum gap between poles
const gap = Math.random() * (maxGap - minGap) + minGap; // Randomize gap
const obstacleTop = Math.random() * (400 - gap); // Randomize pole position

// Top obstacle
const topObstacle = obstacle.cloneNode();
topObstacle.style.height = obstacleTop + "px";
topObstacle.style.top = "0";
topObstacle.style.backgroundImage = "url('https://iili.io/3osLEru.png')"; /* Upper pole image */
topObstacle.style.transform = "rotate(180deg)"; /* Rotate the top pipe */
obstacles.appendChild(topObstacle);

// Bottom obstacle
const bottomObstacle = obstacle.cloneNode();
bottomObstacle.style.height = (600 - obstacleTop - gap) + "px";
bottomObstacle.style.bottom = "0";
bottomObstacle.style.backgroundImage = "url('https://iili.io/3osLMdb.png')"; /* Lower pole image */
obstacles.appendChild(bottomObstacle);

// Move obstacles
let obstacleLeft = 400;
function moveObstacle() {
if (isGameOver) return;
obstacleLeft -= 2;
topObstacle.style.left = obstacleLeft + "px";
bottomObstacle.style.left = obstacleLeft + "px";

// Check for collision
if (
obstacleLeft < 90 &&
obstacleLeft > 50 &&
(birdTop < obstacleTop || birdTop > obstacleTop + gap - 40)
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