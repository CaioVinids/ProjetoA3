const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;
const foodScale = 1.5; // aumenta 50%


const gridSize = 30; // Tamanho aumentado
let snake = [{ x: 150, y: 150, color: "#4caf50" }];
let dx = gridSize;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameLoopTimeout;
let isGameOver = false;

const foodTypes = [
  { name: "plastico", color: "#cb2716", src: "../img/plastico.png" },
  { name: "metal", color: "#d2ac0f", src: "../img/metal.png" },
  { name: "papel", color: "#006aa4", src: "../img/papel.png" },
  { name: "vidro", color: "#295a0f", src: "../img/vidro.png" },
  { name: "maca", color: "#8b6139", src: "../img/maca.png" }
];

const foodImages = {};
foodTypes.forEach(type => {
  const img = new Image();
  img.src = type.src;
  foodImages[type.name] = img;
});

let nextFoodType = getRandomFoodType();
let currentFood = spawnFood(nextFoodType);

function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = segment.color;
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  const image = foodImages[currentFood.type.name];
  const size = gridSize * foodScale;
  const offset = (size - gridSize) / 2;

  ctx.drawImage(
    image,
    currentFood.x - offset,
    currentFood.y - offset,
    size,
    size
  );
}


function updateScore() {
  document.getElementById("scoreValue").textContent = score;
}

function moveSnake() {
  if (isGameOver) return;

  const headX = snake[0].x + dx;
  const headY = snake[0].y + dy;

  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    gameOver();
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === headX && snake[i].y === headY) {
      gameOver();
      return;
    }
  }

  const newHead = { x: headX, y: headY, color: currentFood.type.color };
  snake.unshift(newHead);

  if (headX === currentFood.x && headY === currentFood.y) {
    score++;
    updateScore();

    if (score % 10 === 0 && gameSpeed > 50) {
      gameSpeed -= 5;
    }

    nextFoodType = getRandomFoodType();
    currentFood = spawnFood(nextFoodType);
  } else {
    snake.pop();
  }
}

function getRandomFoodType() {
  const type = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  console.log(`Próxima comida: ${type.name} (${type.color})`);
  return type;
}

function spawnFood(type) {
  const maxX = Math.floor(canvas.width / gridSize);
  const maxY = Math.floor(canvas.height / gridSize);
  const x = Math.floor(Math.random() * maxX) * gridSize;
  const y = Math.floor(Math.random() * maxY) * gridSize;
  return { x, y, type };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  drawFood();
}

function gameOver() {
  clearTimeout(gameLoopTimeout);
  isGameOver = true;
  document.getElementById("finalScoreText").textContent = `Pontuação final: ${score}`;
  document.getElementById("finalSpeedText").textContent = `Velocidade: ${Math.round(1000 / gameSpeed)} FPS`;
  document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() {
  snake = [{ x: 150, y: 150, color: "#4caf50" }];
  dx = gridSize;
  dy = 0;
  score = 0;
  gameSpeed = 100;
  isGameOver = false;
  updateScore();
  nextFoodType = getRandomFoodType();
  currentFood = spawnFood(nextFoodType);
  document.getElementById("gameOverScreen").style.display = "none";
  gameLoop();
}

document.addEventListener("keydown", (event) => {
  if (isGameOver) return;
  if (event.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -gridSize;
  } else if (event.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = gridSize;
  } else if (event.key === "ArrowLeft" && dx === 0) {
    dx = -gridSize;
    dy = 0;
  } else if (event.key === "ArrowRight" && dx === 0) {
    dx = gridSize;
    dy = 0;
  }
});

function gameLoop() {
  if (isGameOver) return;
  draw();
  gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
}

gameLoop();
