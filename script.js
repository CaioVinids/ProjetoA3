const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamanho do canvas
canvas.width = 400;
canvas.height = 400;

// Definições do jogo
const gridSize = 20; // Cada célula tem 20px
let snake = [{ x: 160, y: 160 }]; // Posição inicial da cobra
let food = spawnFood(); // Posição inicial da comida
let dx = gridSize; // Direção da cobra (movimento horizontal)
let dy = 0;
let score = 0;

// Criar um objeto de imagem para a comida
const foodImage = new Image();
foodImage.src = 'garrafa.png';  // Coloque o caminho da imagem da comida

// Função para desenhar a cobra
function drawSnake() {
  ctx.fillStyle = "#4caf50"; // Cor ecológica para a cobra (verde)
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

// Função para desenhar a comida como imagem
function drawFood() {
  ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize); // Desenha a imagem da comida
}

// Função para atualizar a pontuação na tela
function updateScore() {
  document.getElementById("scoreValue").textContent = score;
}

// Função para mover a cobra
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Verificar se a cobra colidiu com o limite
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver();
    return;
  }

  // Verificar se a cobra colidiu consigo mesma
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head); // Adicionar a cabeça da cobra no início do array
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = spawnFood(); // Gerar nova comida
  } else {
    snake.pop(); // Remover a última parte da cobra
  }
}

// Função para gerar a comida em uma posição aleatória
function spawnFood() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

// Função para desenhar o jogo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar a tela
  drawSnake();
  drawFood(); // Desenha a comida usando a imagem
  moveSnake();
}

// Função para finalizar o jogo
function gameOver() {
  alert("Fim de jogo! Pontuação final: " + score);
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  score = 0;
  updateScore();
}

// Função para controlar a direção da cobra com as setas do teclado
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

// Função para o loop do jogo
function gameLoop() {
  draw();
  setTimeout(gameLoop, 100); // Atualiza o jogo a cada 100ms
}

gameLoop();
