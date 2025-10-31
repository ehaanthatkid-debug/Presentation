const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
//i took my pong code from prog one, and searched up how to input it into javascript so that it could be played in a browser with my css components.
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 20;

let ball = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 5 };
let leftPaddle = { x: 10, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
let rightPaddle = { x: CANVAS_WIDTH - 20, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 };
let leftScore = 0;
let rightScore = 0;

let leftMove = 0;
let rightMove = 0;
const PADDLE_SPEED = 8;

document.addEventListener("keydown", e => {
  if (e.key === "w") leftMove = -PADDLE_SPEED;
  if (e.key === "s") leftMove = PADDLE_SPEED;
  if (e.key === "ArrowUp") rightMove = -PADDLE_SPEED;
  if (e.key === "ArrowDown") rightMove = PADDLE_SPEED;
});

document.addEventListener("keyup", e => {
  if (["w", "s"].includes(e.key)) leftMove = 0;
  if (["ArrowUp", "ArrowDown"].includes(e.key)) rightMove = 0;
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function resetBall() {
  ball.x = CANVAS_WIDTH / 2;
  ball.y = CANVAS_HEIGHT / 2;
  ball.dx = -ball.dx;
  ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // move paddles
  leftPaddle.y += leftMove;
  rightPaddle.y += rightMove;

  // keep paddles inside bounds
  leftPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, leftPaddle.y));
  rightPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, rightPaddle.y));

  // move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // top and bottom wall bounce
  if (ball.y - BALL_SIZE / 2 <= 0 || ball.y + BALL_SIZE / 2 >= CANVAS_HEIGHT) {
    ball.dy = -ball.dy;
  }

  // left and right scoring
  if (ball.x <= 0) {
    rightScore++;
    resetBall();
  } else if (ball.x >= CANVAS_WIDTH) {
    leftScore++;
    resetBall();
  }

  // paddle collisions
  if (
    ball.x - BALL_SIZE / 2 <= leftPaddle.x + PADDLE_WIDTH &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + PADDLE_HEIGHT
  ) {
    ball.dx = Math.abs(ball.dx);
  }

  if (
    ball.x + BALL_SIZE / 2 >= rightPaddle.x &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + PADDLE_HEIGHT
  ) {
    ball.dx = -Math.abs(ball.dx);
  }


  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  drawRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  drawBall(ball.x, ball.y, BALL_SIZE, "red");
  document.getElementById("score").innerText = `${leftScore} - ${rightScore}`;

  requestAnimationFrame(update);
}

update();
