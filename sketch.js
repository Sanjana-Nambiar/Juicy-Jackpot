let start_pg;
let instruction_pg;
let game_pg;
let end_pg;
let mango;
let apple;
let guava;
let berry;
let left;
let right;
let fruits = [];
let arrow = [];
let arduino_arrow1 = false;
let arduino_arrow2 = false;
let arduino_fruit1 = false;
let arduino_fruit2 = false;
let arduino_fruit3 = false;
let arduino_fruit4 = false;
let fromArduino = [];

let bg_music;
let hover;
let arcade;

let r = 100;
let score = 0;
let ycord = -20;
let xcord = 200;
let gamespeed = 1.5;

//The gameState controls the navigation to all the screens
let gameState = "startScreen"; // Can be 'start', 'playing', 'end'

function preload() {
  //loading all the medias required
  start_pg = loadImage("Images/1.jpg");
  instruction_pg = loadImage("Images/2.jpg");
  game_pg = loadImage("Images/3.jpg");
  end_pg = loadImage("Images/4.jpg");
  mango = loadImage("Images/yellow.png");
  apple = loadImage("Images/red.png");
  guava = loadImage("Images/green.png");
  berry = loadImage("Images/white.png");
  left = loadImage("Images/left.png");
  right = loadImage("Images/right.png");

  bg_music = loadSound("Music/bgmusic.mp3");
  hover = loadSound("Music/click.mp3");
  arcade = loadSound("Music/arcade.wav");

  fruits = [mango, apple, guava, berry];
  arrow = [left, right];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg_music.loop();
  textAlign(CENTER);
  frameRate(120);
  ball = new Color(xcord, ycord, gamespeed);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // if (!serialActive) {text("Press Space Bar to select Serial Port", 20, 30);}
  // else { text("Connected", 20, 30);

  if (gameState == "startScreen") {
    startScreen();
  } else if (gameState == "instructionScreen") {
    instructionScreen();
  } else if (gameState == "gameScreen") {
    gameScreen();
  } else if (gameState == "endScreen") {
    endScreen();
  }
  // }
}

mouseClicked = function () {
  if (mouseX < 80 && mouseX > 30 && mouseY < 75 && mouseY > 30) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  rect(20, 20, 50, 50);
};

function startScreen() {
  image(start_pg, 0, 0, width, height);
  button("Start", "#B667E6", (3 * width) / 4 - 75, (3 * height) / 4 - 50, 150, 40, 5);
  button("Instructions", "#B667E6", (3 * width) / 4 - 75, (3 * height) / 4, 150, 40, 5);
  button("[ ]", "#B667E6", 30, 30, 50, 45, 10);
}

function instructionScreen() {
  image(instruction_pg, 0, 0, width, height);
  button("Return", "#B667E6", width - 150, height - 100, 120, 50, 5);
}

function gameScreen() {
  // Draw game background image
  image(game_pg, 0, 0, width, height);
  fill("#1B146F");
  rect(0, 0, width, 30);
  textSize(20); // set text size
  fill(255); // set text color
  text("runinng score: ", 75, 20);
  text(score, 150, 20);

  ball.display();
  ball.move();

  let flag = 0;
  let count = 0;

  if (arduino_arrow1 && ball.img == 0) {
    flag = 1;
    arcade.play();
  } else if (arduino_arrow2 && ball.img == 1) {
    flag = 1;
    arcade.play();
  } else if (arduino_fruit4 && ball.img == 1) {
    flag = 2;
    arcade.play();
  } //red
  else if (arduino_fruit2 && ball.img == 2) {
    flag = 2;
    arcade.play();
  } //green
  else if (arduino_fruit3 && ball.img == 3) {
    flag = 2;
    arcade.play();
  } //white
  else if (arduino_fruit1 && ball.img == 0) {
    flag = 2;
    arcade.play();
  } //yellow

  if (flag == 1) {
    ball.img = int(random(fruits.length));
    ball.selection = "fruits";
  }
  if (flag == 2) {
    ball.y = -20;
    ball.x = pickRandom();
    ball.speed += 0.5;
    score += 1;
    ball.selection = "arrow";
    ball.img = int(random(arrow.length));
  }
  if (ball.y > height) {
    ball.speed = gamespeed;
    ball.y = -20;
    ball.x = pickRandom();
    gameState = "endScreen";
  }
}
function pickRandom() {
  let x = random(75, width - 175);
  return x;
}

function endScreen() {
  // ball.speed = gamespeed;
  image(end_pg, 0, 0, width, height);
  button("Restart", "#B667E6", width - 150, height - 50, 120, 30, 5);
  textSize(50); // set text size
  fill(255); // set text color
  text("SCORE:", width / 2, (3 * height) / 4 - 100);
  text(score, width / 2, (3 * height) / 4 - 50);
}

function button(title, button_color, x, y, w, h, conrner_r) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    //Set the hovering over button color;
    button_color = "#67AAE6";

    //Depending on which button the user presses, it will change that screen by updating the gameState
    hover.play();
    if (mouseIsPressed) {
      //Screens
      if (title == "Start") {
        gameState = "gameScreen";
      } else if (title == "Instructions") {
        gameState = "instructionScreen";
      }

      //returning
      if (title == "Return") {
        gameState = "startScreen";
      }

      //restarting
      if (title == "Restart") {
        restartGame();
      }
    }
  }
  //Drawing the button:
  fill(button_color);

  noStroke();
  rect(x, y, w, h, conrner_r);

  //Button text:
  fill(255);
  textFont("Times New Roman", 20);
  text(title, (x + (x + w)) / 2, (y + (y + h) + 15) / 2);
}

//defining a class for the colured balls
class Color {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.img = int(random(arrow.length));
    this.selection = "arrow";
  }
  move() {
    this.y = this.y + this.speed;
  }
  display() {
    if (this.selection == "fruits") {
      image(fruits[this.img], this.x, this.y, r, r);
    } else if (this.selection == "arrow") {
      image(arrow[this.img], this.x, this.y, r, r);
    }
  }
}

//--------------------------------
function keyPressed() {
  if (key == " ") {
    // important to have in order to start the serial connection!!
    setUpSerial();
  }
}
function restartGame() {
  // Reset character position, lives, etc
  gameState = "startScreen";
  score = 0;
}

//---------------------------------
function readSerial(data) {
  //READ FROM ARDUINO HERE
  if (data != null) {
    fromArduino = split(trim(data), ",");
    arduino_arrow1 = fromArduino[0] > 20 ? true : false;
    arduino_arrow2 = fromArduino[1] > 200 ? true : false;

    arduino_fruit1 = fromArduino[2] == 1 ? true : false;
    arduino_fruit2 = fromArduino[3] == 1 ? true : false;
    arduino_fruit3 = fromArduino[4] == 1 ? true : false;
    arduino_fruit4 = fromArduino[5] == 1 ? true : false;
  }
}
