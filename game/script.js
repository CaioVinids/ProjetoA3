const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;
const foodScale = 1.5;

const gridSize = 30;
let snake = [{ x: 150, y: 150, color: "#4caf50" }];
let dx = gridSize;
let dy = 0;
let score = 0;
let level = 1;
let gameSpeed = 150;
let gameLoopTimeout;
let isGameOver = false;

let foodsOnScreen = [];
let snakeColorType = null;
let isWaitingRestart = false;
let isWaitingNextLevel = false;


let foodCountByType = {
  plastico: 0,
  metal: 0,
  papel: 0,
  vidro: 0,
  organico: 0
};

const foodTypes = [
  { name: "plastico", color: "#cb2716", src: "../imgs/plastico.png" },
  { name: "metal", color: "#d2ac0f", src: "../imgs/metal.png" },
  { name: "papel", color: "#006aa4", src: "../imgs/papel.png" },
  { name: "vidro", color: "#295a0f", src: "../imgs/vidro.png" },
  { name: "organico", color: "#8b6139", src: "../imgs/maca.png" }
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
  const size = gridSize * foodScale;
  const offset = (size - gridSize) / 2;

  if (level === 1) {
    const image = foodImages[currentFood.type.name];
    ctx.drawImage(image, currentFood.x - offset, currentFood.y - offset, size, size);
  } else {
    foodsOnScreen.forEach(food => {
      const image = foodImages[food.type.name];
      ctx.drawImage(image, food.x - offset, food.y - offset, size, size);
    });
  }
}

function updateScore() {
  document.getElementById("scoreValue").textContent = score;
}

function updateLevelDisplay() {
  document.getElementById("levelValue").textContent = level;
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

  const newHead = { x: headX, y: headY, color: snake[0].color };
  snake.unshift(newHead);

  let ateFood = false;

  if (level === 1) {
    if (headX === currentFood.x && headY === currentFood.y) {
      ateFood = true;
      foodCountByType[currentFood.type.name]++;
    }
  } else {
    for (let food of foodsOnScreen) {
      if (headX === food.x && headY === food.y) {
        if (food.type.name !== snakeColorType.name) {
          gameOver();
          return;
        }
        ateFood = true;
        foodCountByType[food.type.name]++;
        break;
      }
    }
  }

  if (ateFood) {
    score++;
    updateScore();

    if (score % 10 === 0) {
      level++;
      updateLevelDisplay();
      showNextLevelScreen();
      return;
    }


    if (score % 10 === 0 && gameSpeed > 50) {
      gameSpeed -= 5;
    }

    if (level === 1) {
      nextFoodType = getRandomFoodType();
      currentFood = spawnFood(nextFoodType);
      snake[0].color = currentFood.type.color;
    } else {
      prepareMultiFoodLevel();
    }

  } else {
    snake.pop();
  }
}

function getRandomFoodType() {
  return foodTypes[Math.floor(Math.random() * foodTypes.length)];
}

function spawnFood(type) {
  const maxX = Math.floor(canvas.width / gridSize);
  const maxY = Math.floor(canvas.height / gridSize);
  const x = Math.floor(Math.random() * maxX) * gridSize;
  const y = Math.floor(Math.random() * maxY) * gridSize;
  return { x, y, type };
}

function prepareMultiFoodLevel() {
  foodsOnScreen = [];
  const foodCount = Math.min(level, foodTypes.length);
  const usedTypes = new Set();

  while (foodsOnScreen.length < foodCount) {
    const type = getRandomFoodType();
    if (usedTypes.has(type.name)) continue;

    let food;
    let tries = 0;
    do {
      food = spawnFood(type);
      tries++;
    } while (
      isOccupied(food.x, food.y) &&
      tries < 50 // evita loop infinito em caso de tela cheia
    );

    if (tries < 50) {
      foodsOnScreen.push(food);
      usedTypes.add(type.name);
    }
  }

  // Define a cor da cobra com base em um dos alimentos
  snakeColorType = foodsOnScreen[Math.floor(Math.random() * foodsOnScreen.length)].type;

  if (snake.length > 0) {
    snake[0].color = snakeColorType.color;
  }
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

  const statsDiv = document.getElementById("finalStats");
  statsDiv.innerHTML = "<h3>Itens coletados:</h3><ul>" +
    Object.entries(foodCountByType)
      .map(([type, count]) => `<li><strong>${type}:</strong> ${count}</li>`)
      .join("") +
    "</ul>";

  document.getElementById("gameOverScreen").style.display = "flex";
  isWaitingRestart = true;

}

function restartGame() {
  snake = [{ x: 150, y: 150, color: "#4caf50" }];
  dx = gridSize;
  dy = 0;
  score = 0;
  level = 1;
  gameSpeed = 100;
  isGameOver = false;
  foodsOnScreen = [];
  snakeColorType = null;
  foodCountByType = {
    plastico: 0,
    metal: 0,
    papel: 0,
    vidro: 0,
    organico: 0
  };
  updateScore();
  updateLevelDisplay();
  nextFoodType = getRandomFoodType();
  currentFood = spawnFood(nextFoodType);
  document.getElementById("gameOverScreen").style.display = "none";
  gameLoop();
}

function gameLoop() {
  if (isGameOver) return;
  draw();
  gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
}

updateScore();
updateLevelDisplay();
gameLoop();

function showNextLevelScreen() {
  clearTimeout(gameLoopTimeout);
  isGameOver = true;

  const statsDiv = document.getElementById("levelStats");
  statsDiv.innerHTML = "<h3>Itens coletados até agora:</h3><ul>" +
    Object.entries(foodCountByType)
      .map(([type, count]) => `<li><strong>${type}:</strong> ${count}</li>`)
      .join("") +
    "</ul>";

  document.getElementById("nextLevelScreen").style.display = "flex";
  isWaitingNextLevel = true;

}

function continueToNextLevel() {
  isGameOver = false;
  document.getElementById("nextLevelScreen").style.display = "none";

  if (gameSpeed > 50) {
    gameSpeed -= 5;
  }

  if (level === 1) {
    nextFoodType = getRandomFoodType();
    currentFood = spawnFood(nextFoodType);
    snake[0].color = currentFood.type.color;
  } else {
    prepareMultiFoodLevel();
  }

  gameLoop();
}

function isOccupied(x, y) {
  // Verifica se colide com a cobra
  for (let segment of snake) {
    if (segment.x === x && segment.y === y) return true;
  }

  // Verifica se colide com outros alimentos já posicionados
  for (let food of foodsOnScreen) {
    if (food.x === x && food.y === y) return true;
  }

  return false;
}


document.addEventListener("keydown", (event) => {
  if (isWaitingRestart) {
    isWaitingRestart = false;
    restartGame();
    return;
  }

  if (isWaitingNextLevel) {
    isWaitingNextLevel = false;
    continueToNextLevel();
    return;
  }

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