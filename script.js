// ---------------------
// Global Variables
// ---------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let score = 0;
let gameOver = false;

// Player settings
const PLAYER_SIZE = 40;
const player = {
  x: WIDTH / 2 - PLAYER_SIZE / 2,
  y: HEIGHT - PLAYER_SIZE * 2,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  speed: 5
};

// Obstacle settings
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 30;
const obstacles = [];

// Gem settings
const GEM_SIZE = 20;
const gems = [];

// Keyboard input tracking
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false
};

// ---------------------
// Event Listeners
// ---------------------
document.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// ---------------------
// Helper Functions
// ---------------------

// AABB (Axis-Aligned Bounding Box) collision check
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Spawn a new obstacle at the top
function spawnObstacle() {
  const obstacle = {
    x: Math.random() * (WIDTH - OBSTACLE_WIDTH),
    y: -OBSTACLE_HEIGHT,
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    speed: Math.floor(Math.random() * 5) + 3 // speed between 3-7
  };
  obstacles.push(obstacle);
}

// Spawn a new gem at the top
function spawnGem() {
  const gem = {
    x: Math.random() * (WIDTH - GEM_SIZE),
    y: -GEM_SIZE,
    width: GEM_SIZE,
    height: GEM_SIZE,
    speed: Math.floor(Math.random() * 4) + 2 // speed between 2-5
  };
  gems.push(gem);
}

// Update score display on the page
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay');
  scoreDisplay.textContent = `Score: ${score}`;
}

// Show "Game Over" message
function showGameOver() {
  const msg = document.getElementById('gameOverMsg');
  msg.style.display = 'block';
}

// ---------------------
// Game Functions
// ---------------------

function update() {
  if (gameOver) return;

  // Player movement
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight && player.x + player.width < WIDTH) {
    player.x += player.speed;
  }
  if (keys.ArrowUp && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys.ArrowDown && player.y + player.height < HEIGHT) {
    player.y += player.speed;
  }

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.y += obs.speed;

    // If obstacle goes off screen, remove it
    if (obs.y > HEIGHT) {
      obstacles.splice(i, 1);
    } 
    // Check collision with player
    else if (isColliding(player, obs)) {
      gameOver = true;
      showGameOver();
    }
  }

  // Update gems
  for (let i = gems.length - 1; i >= 0; i--) {
    const gem = gems[i];
    gem.y += gem.speed;

    // If gem goes off screen, remove it
    if (gem.y > HEIGHT) {
      gems.splice(i, 1);
    } 
    // Check collision with player
    else if (isColliding(player, gem)) {
      score += 10;
      updateScoreDisplay();
      gems.splice(i, 1);
    }
  }
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw player (blue)
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles (red)
  ctx.fillStyle = 'red';
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }

  // Draw gems (yellow)
  ctx.fillStyle = 'yellow';
  for (let gem of gems) {
    ctx.fillRect(gem.x, gem.y, gem.width, gem.height);
  }
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// ---------------------
// Initialize the Game
// ---------------------
function init() {
  updateScoreDisplay();
  
  // Start spawning obstacles and gems
  setInterval(spawnObstacle, 1000); // every 1 second
  setInterval(spawnGem, 3000);      // every 3 seconds

  // Start the game loop
  requestAnimationFrame(gameLoop);
}

// Start
init();
