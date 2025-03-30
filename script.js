/* VARIABLES */
let rocket, sadCat;
let score = 0;
let backgroundImg;
let sadCatImg;
let rocketImg;
let happyCatImg;
let projectile;
let isProjectileActive = false;

/* PRELOAD LOADS FILES */
function preload() {
  backgroundImg = loadImage("assets/spaceBg.png");
  sadCatImg = loadImage("assets/sadCat.png");
  rocketImg = loadImage("assets/rocket.png");
  happyCatImg = loadImage("assets/happyCat.png");
}

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(400, 400);

  // Resize images
  backgroundImg.resize(900, 400);
  sadCatImg.resize(80, 0);
  rocketImg.resize(200, 0);

  // Create rocket 
  rocket = new Sprite(rocketImg, 200, 380, 60, 60, "k");
  rocket.color = color(95, 158, 160);
  rocket.vel.x = 3;

  // Create falling object
  sadCat = new Sprite(sadCatImg, 100, 0, 10);
  sadCat.color = color(0, 128, 128);
  sadCat.vel.y = 2;
  sadCat.rotationLock = true;

  // Create Projectile
  projectile = { x: rocket.x, y: rocket.y, width: 10, height: 20, speed: 8, };
  projectile.collider = "k";
}

/* DRAW LOOP REPEATS */
function draw() {
  background(224, 224, 224);

  // Draw background
  image(backgroundImg, 0, 0);

  // Draw directions to screen
  fill("white");
  textSize(12);
  text(
    "Use the Arrow Keys\nto Move the Rocket!\nSpace to Shoot!",
    width - 120,
    40
  );

  // No rotation
  sadCat.rotationLock = true;

  // Move rocket
  if (kb.pressing("left")) {
    rocket.vel.x = -3;
  } else if (kb.pressing("right")) {
    rocket.vel.x = 3;
  } else if (kb.pressing("up")) {
    rocket.vel.y = -3;
  } else if (kb.pressing("down")) {
    rocket.vel.y = 3;
  } else {
    rocket.vel.x = 0;
    rocket.vel.y = 0;
  }

  // Stop rocket at edges of screen
  if (rocket.x < 30) {
    rocket.x = 30;
  } else if (rocket.x > 373) {
    rocket.x = 373;
  } else if (rocket.y < 10) {
    rocket.y = 10;
  } else if (rocket.y > 390) {
    rocket.y = 390;
  }

  // Shoot projectile
  if (kb.presses("space") && !isProjectileActive) {
    projectile.x = rocket.x;
    projectile.y = rocket.y;
    isProjectileActive = true;
  }

  // Update projectile position
  if (isProjectileActive) {
    projectile.y -= projectile.speed;

    // Deactivate projectile if it goes off-screen
    if (projectile.y < 0) {
      isProjectileActive = false;
    }

    // Check for collision with sadCat
    if (projectile.y - projectile.height < sadCat.y + sadCat.height / 2 &&
        projectile.y > sadCat.y - sadCat.height / 2 &&
        projectile.x + projectile.width / 2 > sadCat.x - sadCat.width / 2 &&
        projectile.x - projectile.width / 2 < sadCat.x + sadCat.width / 2) {
      // Collision detected, reset sadCat and deactivate projectile
      sadCat.y = 0;
      sadCat.x = random(width);
      sadCat.vel.y = random(2, 5);
      score++;
      isProjectileActive = false;
    }
  }

  // Draw projectile if active
  if (isProjectileActive) {
    fill("red");
    rect(projectile.x - projectile.width / 2, projectile.y - projectile.height, projectile.width, projectile.height);
  }

  // If sadCat collides with rocket, move back to random position at top
  if (sadCat.collides(rocket)) {
    sadCat.y = 0;
    sadCat.x = random(width);
    sadCat.vel.y = random(2, 5);
    sadCat.direction = "down";
    score = score + 1;
  } else {
    if (sadCat.y >= height) {
      sadCat.y = 0;
      sadCat.x = random(width);
      sadCat.vel.y = random(1, 5);
      score = score - 1;
    }
  }

  // Draw the score on screen
  fill("gold");
  textSize(20);
  text.storke = "black";
  text("Score = " + score, 20, 50);

  // Lose condition and Win condition
  if (score <= -1) {
    fill("red");
    textSize(25);
    text("You Lose!", width / 2 - 65, height / 2);
    textSize(18);
    fill("white");
    text("Click to Restart", width / 2 - 70, height / 2 + 30);
    rocket.y = -100;
    sadCat.y = -100;
  }
  if (score >= 10) {
    youWin();
    textSize(18);
    fill("white");
    text("click to restart", width / 2 - 70, height / 2 + 30);
  }
  if (mouseIsPressed) {
    restart();
  }
}

// Win condition
function youWin() {
  fill("yellow");
  textSize(25);
  text("You Win!", width / 2 - 65, height / 2);
  rocket.y = -100;
  sadCat.y = -100;
}

// Restart function
function restart() {
  score = 0;
  rocket.x = 200;
  rocket.y = 380;
  sadCat.y = 0;
  sadCat.x = random(width);
  sadCat.vel.y = random(2, 5);
  sadCat.direction = "down";
}
