const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const gridSize = 20;
let snake = [{ x: 160, y: 160, color: "#4caf50" }];
let dx = gridSize;
let dy = 0;
let score = 0;
let gameSpeed = 100; // Velocidade inicial em ms (100ms por frame)

// Tipos de comida com nome, cor e imagem
const foodTypes = [
  { name: "plastico", color: "#cb2716", src: "../img/plastico.png" },
  { name: "metal", color: "#d2ac0f", src: "../img/metal.png" },
  { name: "papel", color: "#006aa4", src: "../img/papel.png" },
  { name: "vidro", color: "#295a0f", src: "../img/vidro.png" },
  { name: "maca", color: "#8b6139", src: "../img/maca.png" }
];

// Carrega imagens das comidas
const foodImages = {};
foodTypes.forEach(type => {
  const img = new Image();
  img.src = type.src;
  foodImages[type.name] = img;
});

// Inicializa com uma comida aleatória
let nextFoodType = getRandomFoodType();
let currentFood = spawnFood(nextFoodType);

// Desenha a cobra com rastro colorido
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = segment.color;
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

// Desenha a comida
function drawFood() {
  const image = foodImages[currentFood.type.name];
  ctx.drawImage(image, currentFood.x, currentFood.y, gridSize, gridSize);
}

// Atualiza pontuação na tela
function updateScore() {
  document.getElementById("scoreValue").textContent = score;
}

// Move a cobra e lida com colisões
function moveSnake() {
  const headX = snake[0].x + dx;
  const headY = snake[0].y + dy;

  // Colisão com parede
  if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height) {
    gameOver();
    return;
  }

  // Colisão com o próprio corpo
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === headX && snake[i].y === headY) {
      gameOver();
      return;
    }
  }

  // Cria a nova cabeça com a cor da comida que vai aparecer
  const newHead = { x: headX, y: headY, color: currentFood.type.color };
  snake.unshift(newHead);

  // Se comeu a comida
  if (headX === currentFood.x && headY === currentFood.y) {
    score++;
    updateScore();

    // Aumenta a velocidade a cada 5 comidas, até um limite
    if (score % 10 === 0 && gameSpeed > 50) {
      gameSpeed -= 5;
    }

    nextFoodType = getRandomFoodType();      // Define próxima comida
    currentFood = spawnFood(nextFoodType);   // Aparece na tela
  } else {
    snake.pop(); // Remove a cauda se não comeu
  }
}

// Sorteia novo tipo de comida
function getRandomFoodType() {
  const type = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  console.log(`Próxima comida: ${type.name} (${type.color})`);
  return type;
}

// Gera nova comida com tipo específico
function spawnFood(type) {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y, type };
}

// Desenha tudo em ordem correta
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();    // Atualiza lógica do jogo
  drawSnake();    // Cobra com cores corretas
  drawFood();     // Desenha comida atual
}

// Fim de jogo
function gameOver() {
  alert("Fim de jogo! Pontuação final: " + score);
  snake = [{ x: 160, y: 160, color: "#4caf50" }];
  dx = gridSize;
  dy = 0;
  score = 0;
  gameSpeed = 100; // Reseta velocidade
  updateScore();
  nextFoodType = getRandomFoodType();
  currentFood = spawnFood(nextFoodType);
}

// Teclas de controle
document.addEventListener("keydown", (event) => {
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

// Loop principal com velocidade variável
function gameLoop() {
  draw();
  setTimeout(gameLoop, gameSpeed);
}

gameLoop();
