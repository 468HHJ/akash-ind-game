const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 25; 
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 100; 
}

let snake = [{ x: 9 * gridSize, y: 9 * gridSize }];
let dx = gridSize;
let dy = 0;
let food = randomFood();

let snakeImage = null;
let foodImage = null;
let bgColor = "#000000"; // default black

// image upload
document.getElementById("snakeImageInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => { snakeImage = img; };
  }
});

document.getElementById("foodImageInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => { foodImage = img; };
  }
});

// background color picker
document.getElementById("bgColorPicker").addEventListener("input", (e) => {
  bgColor = e.target.value;
});

document.addEventListener("keydown", changeDirection);

// swipe controls (mobile)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  let dxTouch = touch.clientX - touchStartX;
  let dyTouch = touch.clientY - touchStartY;

  if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
    if (dxTouch > 0 && dx === 0) { dx = gridSize; dy = 0; }
    else if (dxTouch < 0 && dx === 0) { dx = -gridSize; dy = 0; }
  } else {
    if (dyTouch > 0 && dy === 0) { dx = 0; dy = gridSize; }
    else if (dyTouch < 0 && dy === 0) { dx = 0; dy = -gridSize; }
  }
});

function changeDirection(event) {
  if (event.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
  else if (event.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
  else if (event.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
  else if (event.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
}

function drawSnake() {
  snake.forEach((part, index) => {
    if (snakeImage) {
      ctx.drawImage(snakeImage, part.x, part.y, gridSize, gridSize);
    } else {
      ctx.fillStyle = index === 0 ? "lime" : "green";
      ctx.fillRect(part.x, part.y, gridSize, gridSize);
    }
  });
}

function drawFood() {
  if (foodImage) {
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
  }
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
  };
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
    resetGame();
    return;
  }

  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }
}

function resetGame() {
  snake = [{ x: 9 * gridSize, y: 9 * gridSize }];
  dx = gridSize;
  dy = 0;
  food = randomFood();
}

function gameLoop() {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawSnake();
  drawFood();
  update();
}

setInterval(gameLoop, 120);
