const bird = document.getElementById("bird");
const game = document.getElementById("game");
const obstacles = document.getElementById("obstacles");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const finalScore = document.getElementById("final-score");
const bestScore = document.getElementById("best-score");
const crashSound = document.getElementById("crash-sound"); 

let birdTop = 250;
let birdVelocity = 0;
let gravity = 0.5;
let isGameOver = false;
let score = 0;
let best = 0;
let gameInterval;
let obstacleInterval;

// Game start
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  game.style.display = "block";
  startGame();
});

// Game restart
restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  game.style.display = "block";
  startGame();
});

function startGame() {
  // Reset game 
  isGameOver = false;
  birdTop = 250;
  birdVelocity = 0;
  score = 0;
  obstacles.innerHTML = "";
  bird.style.top = birdTop + "px";

  // Start game loop
  applyGravity();
  gameInterval = setInterval(createObstacle, 2000);
}

// gravity thing
function applyGravity() {
  if (isGameOver) return;
  birdVelocity += gravity;
  birdTop += birdVelocity;
  bird.style.top = birdTop + "px";

  //  game over when bird hits the ground or flies too high
  if (birdTop > 560 || birdTop < 0) {
    gameOver();
  }

  requestAnimationFrame(applyGravity);
}

// Jumping thing
function jump() {
  if (isGameOver) return;
  birdVelocity = -5; 
}
document.addEventListener("click", jump); 
document.addEventListener("touchstart", jump); 

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

function createObstacle() {
  if (isGameOver) return;
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  const minGap = 150; 
  const maxGap = 230; 
  const gap = Math.random() * (maxGap - minGap) + minGap; 
  const maxGapPosition = 600 - gap; 
  const gapPosition = Math.random() * maxGapPosition; 

  // Fixed pole height 
  const poleHeight = 400; 

  // Top obstacle
  const topObstacle = obstacle.cloneNode();
  topObstacle.style.height = `${poleHeight}px`; 
  topObstacle.style.top = `${gapPosition - poleHeight}px`;
  topObstacle.style.backgroundImage = "url('https://iili.io/3oyssou.png')";  
 
  obstacles.appendChild(topObstacle);

  // Bottom obstacle
  const bottomObstacle = obstacle.cloneNode();
  bottomObstacle.style.height = `${poleHeight}px`; 
  bottomObstacle.style.top = `${gapPosition + gap}px`; 
  bottomObstacle.style.backgroundImage = "url('https://iili.io/3oysPte.png')"; 
  obstacles.appendChild(bottomObstacle);

  // Move obstacles
  let obstacleLeft = 400;
  function moveObstacle() {
    if (isGameOver) return;
    obstacleLeft -= 2;
    topObstacle.style.left = `${obstacleLeft}px`;
    bottomObstacle.style.left = `${obstacleLeft}px`;

    // Bird dimensions
    const birdBottom = birdTop + 40; // height
    const birdRight = 50 + 40; // width

    // collision detectiom
    if (
      obstacleLeft < birdRight && // within the bird's horizontal range
      obstacleLeft + 60 > 50 && // Pole not too far to the left
      (birdTop < gapPosition || birdBottom > gapPosition + gap) // Bird collides with top or bottom pole
    ) {
      gameOver();
    }

    // score increase
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

// Game over 
function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);


  crashSound.play();

  // best score
  if (score > best) {
    best = score;
    bestScore.textContent = best;
  }

  // game over screen
  game.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScore.textContent = score;
}

// front page flex with start option
startScreen.style.display = "block";
