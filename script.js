const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const catImage = new Image();
catImage.src = 'cat.png';

const cupImage = new Image();
cupImage.src = 'cup.png';

let basket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 60, // Adjust based on cup image height
  width: 100, // Adjust based on cup image width
  height: 60, // Adjust based on cup image height
  dx: 5
};

let objects = [];
let score = 0;
let lives = 9;

function drawBasket() {
  ctx.drawImage(cupImage, basket.x, basket.y, basket.width, basket.height);
}

function drawObject(object) {
  ctx.drawImage(catImage, object.x, object.y, object.size * 2, object.size); // Twice as wide
}

function generateObject() {
  const size = 40; // Adjust based on cat image height
  const x = Math.random() * (canvas.width - size * 2); // Ensure it fits within the canvas
  const y = -size;
  const dy = 2 + Math.random() * 3;

  objects.push({ x, y, size, dy });
}

function updateObjects() {
  objects.forEach(object => {
    object.y += object.dy;
  });

  // Check for collisions and missed objects
  objects.forEach(object => {
    if (
      object.y + object.size > basket.y &&
      object.x < basket.x + basket.width &&
      object.x + object.size * 2 > basket.x // Check with twice the width
    ) {
      score++;
      object.y = canvas.height; // Move object out of canvas to remove it
    } else if (object.y >= canvas.height) {
      lives--;
      object.y = canvas.height; // Move object out of canvas to remove it
      if (lives <= 0) {
        alert("Game Over! You missed 9 cats.");
        document.location.reload();
      }
    }
  });

  // Remove objects that are out of the canvas
  objects = objects.filter(object => object.y < canvas.height);
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Lives: ${lives}`, 10, 50);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBasket() {
  if (rightPressed && basket.x < canvas.width - basket.width) {
    basket.x += basket.dx;
  } else if (leftPressed && basket.x > 0) {
    basket.x -= basket.dx;
  }
}

function update() {
  updateBasket();
  updateObjects();
}

function draw() {
  clearCanvas();
  drawBasket();
  objects.forEach(drawObject);
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

setInterval(generateObject, 1000);

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = true;
  }
});

document.addEventListener('keyup', event => {
  if (event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = false;
  }
});

Promise.all([catImage.decode(), cupImage.decode()]).then(() => {
  gameLoop();
});
