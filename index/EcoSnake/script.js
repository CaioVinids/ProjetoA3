const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let food = spawnFood();
let dx = gridSize;
let dy = 0;
let score = 0;

const snakeColors = ["#FFD700", "#2196F3", "#4caf50", "#F44336", "#874312"];
let snakeColor = "#4caf50";
let foodColor = snakeColor;

let lastDirection = { dx: gridSize, dy: 0 };

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * snakeColors.length);
  return snakeColors[randomIndex];
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function updateScore() {
  document.getElementById("scoreValue").textContent = score;
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  lastDirection = { dx, dy };

  // Wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = spawnFood();
    snakeColor = getRandomColor();
    foodColor = snakeColor;
  } else {
    snake.pop();
  }
}

function spawnFood() {
  let newFood;
  while (true) {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    newFood = { x, y };

    const overlap = snake.some(segment => segment.x === x && segment.y === y);
    if (!overlap) break;
  }
  return newFood;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();
}

function gameOver() {
  alert("Fim de jogo! Pontuação final: " + score);
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  score = 0;
  updateScore();
  snakeColor = "#4caf50";
  foodColor = snakeColor;
}

document.addEventListener("keydown", (event) => {
  const { dx: lastDx, dy: lastDy } = lastDirection;

  if (event.key === "ArrowUp" && lastDy === 0) {
    dx = 0;
    dy = -gridSize;
  } else if (event.key === "ArrowDown" && lastDy === 0) {
    dx = 0;
    dy = gridSize;
  } else if (event.key === "ArrowLeft" && lastDx === 0) {
    dx = -gridSize;
    dy = 0;
  } else if (event.key === "ArrowRight" && lastDx === 0) {
    dx = gridSize;
    dy = 0;
  }
});

function gameLoop() {
  draw();
  setTimeout(gameLoop, 100);
}

gameLoop();