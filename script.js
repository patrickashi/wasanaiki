const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerName = "";
let score = 0;
let gameOver = false;
let obstacleSpeed = 3;
let obstacles = [];

// Player object that controls its position
const player = {
  x: canvas.width / 2 - 35,
  y: canvas.height - 120,
  width: 70,
  height: 70,
  speed: 5,
  dx: 0
};

let touchStartX = 0;  // Stores the initial X position of touch
let isDragging = false; // Flag to check if the player is dragging

function startGame() {
    playerName = document.getElementById("playerNameInput").value || "Player";
    document.getElementById("welcomeScreen").style.display = "none";
    createPlayer();
    gameLoop();
}

// Create the player robot element
function createPlayer() {
    const playerElement = document.createElement("div");
    playerElement.id = "player";
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
    document.body.appendChild(playerElement);

    // Create robot eyes
    const leftEye = document.createElement("div");
    leftEye.classList.add("leftEye");
    playerElement.appendChild(leftEye);

    const rightEye = document.createElement("div");
    rightEye.classList.add("rightEye");
    playerElement.appendChild(rightEye);
}

function drawPlayer() {
    const playerElement = document.getElementById("player");
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
}

function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        if (obs.shape === "square") {
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        } else {
            ctx.arc(obs.x, obs.y, obs.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            document.getElementById("score").innerText = score;
            if (score % 5 === 0) obstacleSpeed += 0.5;
        }
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            endGameScreen();
        }
    }
}

function createObstacle() {
    if (!gameOver) {
        const size = Math.random() * 50 + 20;
        const x = Math.random() * (canvas.width - size);
        const shape = Math.random() > 0.5 ? "square" : "circle";
        obstacles.push({ x, y: -size, width: size, height: size, shape });
    }
}

setInterval(createObstacle, 1000);

// Touch event listeners for dragging
canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging = true;
});

canvas.addEventListener("touchmove", (e) => {
    if (isDragging) {
        const touchMoveX = e.touches[0].clientX;
        const dx = touchMoveX - touchStartX;
        player.x += dx;

        // Prevent the player from moving out of bounds
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        touchStartX = touchMoveX; // Update the start position for the next frame
    }
});

canvas.addEventListener("touchend", () => {
    isDragging = false;
});

// Game loop for updating the game every frame
function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame
        updateObstacles(); // Move obstacles
        drawObstacles(); // Draw obstacles
        drawPlayer(); // Update player position on screen
        requestAnimationFrame(gameLoop); // Call gameLoop recursively to animate
    }
}

// End game screen
function endGameScreen() {
    gameOver = true;
    document.getElementById("gameOverScreen").style.display = "flex";
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverText").innerText = `Game Over! Do better, ${playerName}!`;
}

function restartGame() {
    document.location.reload();
}

function endGame() {
    alert("Thanks for playing!");
}
