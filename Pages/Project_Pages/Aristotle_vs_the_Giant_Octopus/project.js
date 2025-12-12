
const SCALE_FACTOR = 2;
const BASE_CANVAS_WIDTH = 1000;
const BASE_CANVAS_HEIGHT = 400;
const scaleValue = (value) => value * SCALE_FACTOR;
const GROUND_Y = scaleValue(300);
const PLAYER_START_LEFT_X = scaleValue(200);
const PLAYER_START_RIGHT_OFFSET = scaleValue(200);
const RACQUET_LENGTH = scaleValue(50);
const PLAYER_MOVE_SPEED = scaleValue(5);
const PLAYER_JUMP_VELOCITY = scaleValue(15);
const PLAYER_JUMP_GRAVITY = scaleValue(1);
const BALL_START_X = scaleValue(150);
const BALL_START_Y = scaleValue(100);
const BALL_SPEED = scaleValue(5);
const BALL_RADIUS = scaleValue(10);
const BALL_ACCELERATION = 0.05 * SCALE_FACTOR;
const FLOOR_COLLISION_OFFSET = scaleValue(20);
const NET_COLLISION_RANGE = scaleValue(5);
const NET_HEIGHT_OFFSET = scaleValue(150);
const HIT_DISTANCE = scaleValue(30);
const HAND_ANIMATION_STEP = scaleValue(2);
const HAND_ANIMATION_LIMIT = scaleValue(125);
const HAND_OFFSET_X_LEFT = scaleValue(25);
const HAND_OFFSET_X_RIGHT = scaleValue(70);
const HAND_OFFSET_Y = scaleValue(100);
const FLOOR_IMAGE_Y = scaleValue(380);
const FLOOR_IMAGE_HEIGHT = scaleValue(80);
const NET_STROKE_WEIGHT = scaleValue(4);
const NET_BASE_OFFSET = scaleValue(15);
const WIN_TEXT_SIZE = scaleValue(70);
const QUOTE_TEXT_SIZE = scaleValue(40);
const SCORE_TEXT_SIZE = scaleValue(90);
const HINT_TEXT_SIZE = scaleValue(40);

//class of player objects
class racquet {
  //length is the distance from the bottom of the racquet to the center of its head. x and y are the starting x and y positions of the the bottom of the racquet. Mode determines if the racquet is on the left or on the right
  constructor(length, x, y, mode) {
    this.mode = mode;
    this.length = length;
    
    //position of the bottom of the racquet
    this.center = createVector(x, y);
    //velocity and acceleration of the bottom of the racquet
    this.v = createVector();
    this.a = createVector();
    
    //position of the center of the racquet's head
    this.pos = createVector(this.center.x - length, this.center.y); 
    //velocity of the center of the racquet's head
    this.velocity = createVector(0, 0);
    
    //determines if the player is jumping/swinging
    this.swingState = false;
    this.jumpState = false;    
  }

  show() {
    push();
    
    //draws the player figure
    if (this.mode == 1) {
      image(
        img1,
        this.center.x - scaleValue(40),
        this.center.y - scaleValue(60)
      );
    } else {
      image(
        img2,
        this.center.x - scaleValue(150),
        this.center.y - scaleValue(130)
      );
    }
    
    //draws the racquet
    stroke(random(200, 255));
    strokeWeight(scaleValue(1));
    fill(random(0, 30), 200);
    line(this.pos.x, this.pos.y, this.center.x, this.center.y);
    circle(this.pos.x, this.pos.y, scaleValue(35));
    circle(this.center.x, this.center.y, scaleValue(1));

    pop();
  }
  swing() {
    //if player swings, put the racquet in circular motion. 
    if (this.swingState) {
      if (this.mode == 1) {
        this.velocity.set(
          -p5.Vector.sub(this.pos, this.center).y,
          p5.Vector.sub(this.pos, this.center).x
        );
      } else {
        this.velocity.set(
          p5.Vector.sub(this.pos, this.center).y,
          -p5.Vector.sub(this.pos, this.center).x
        );
      }
      this.velocity.setMag(scaleValue(7));
      this.pos.add(this.velocity);
      
      //stops swinging after the racquet swings 180 degrees
      if (this.mode == 1) {
        if (this.pos.x > this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.jumpState = false;
          this.center.set(this.center.x, GROUND_Y);
          this.pos.set(this.center.x - this.length, GROUND_Y);
        }
      } else {
        if (this.pos.x < this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.jumpState = false;
          this.center.set(this.center.x, GROUND_Y);
          this.pos.set(this.center.x - this.length, GROUND_Y);
        }
      }
    }
  }
  //checks when a player is out of bounds
  outOfBounds() {
    if (this.mode == 1) {
      if (this.pos.x < scaleValue(17.5)) {
        return "left";
      } else if (this.center.x > width / 2 - scaleValue(80)) {
        return "right";
      }
      return false;
    }
    if (this.mode == 2) {
      if (this.pos.x > width - scaleValue(17.5)) {
        return "right";
      } else if (this.center.x < width / 2 + scaleValue(80)) {
        return "left";
      }
      return false;
    }
  }
  //resets player to starting position
  reset() {
    this.swingState = false;
    this.jumpState = false;
    if (this.mode == 1) {
      this.center.set(PLAYER_START_LEFT_X, GROUND_Y);
    } else {
      this.center.set(width - PLAYER_START_RIGHT_OFFSET, GROUND_Y);
    }
  }
  jump() {
    //if player jumps, put the player in an upward velocity and downward acceleration
    if (this.jumpState) {
      this.v.add(this.a);
      this.center.add(this.v);

      //stops jumping when player reaches the ground
      if (this.center.y == GROUND_Y) {
        this.jumpState = false;
      }
    }

    //checks when a player presses the key to jump
    if (this.mode == 1) {
      if (keyIsDown(UP_ARROW) && this.center.y == GROUND_Y) {
        this.jumpState = true;
        this.v.set(0, -PLAYER_JUMP_VELOCITY);
        this.a.set(0, PLAYER_JUMP_GRAVITY);
      }
    } else {
      if (keyIsDown(87) && this.center.y == GROUND_Y) {
        this.jumpState = true;
        this.v.set(0, -PLAYER_JUMP_VELOCITY);
        this.a.set(0, PLAYER_JUMP_GRAVITY);
      }
    }
  }
  //checks when a player presses the key to swing and move
  update() {
    if (this.mode == 1) {
      if (keyIsDown(13) == true) {
        this.swingState = true;
      }

      if (this.swingState == false) {
        this.jump();
        if (keyIsDown(LEFT_ARROW) && this.outOfBounds() != "left") {
          this.center.x -= PLAYER_MOVE_SPEED;
        }
        if (keyIsDown(RIGHT_ARROW) && this.outOfBounds() != "right") {
          this.center.x += PLAYER_MOVE_SPEED;
        }

        this.pos.set(this.center.x - this.length, this.center.y);
      }
    } else {
      if (keyIsDown(SHIFT) == true) {
        this.swingState = true;
      }

      if (this.swingState == false) {
        this.jump();
        if (keyIsDown(65) && this.outOfBounds() != "left") {
          this.center.x -= PLAYER_MOVE_SPEED;
        }
        if (keyIsDown(68) && this.outOfBounds() != "right") {
          this.center.x += PLAYER_MOVE_SPEED;
        }

        this.pos.set(this.center.x - this.length, this.center.y);
      }
    }
  }
}
class ball {
  constructor() {
    this.pos = createVector(BALL_START_X, BALL_START_Y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, BALL_ACCELERATION);
    
    //checks when the ball is hit/on the ground
    this.hitState = false;
    this.fallState = false;
  }
  //draws the ball
  show() {
    push();
    noStroke();
    fill(random(150, 255), random(150, 255), random(150, 255));
    circle(this.pos.x, this.pos.y, BALL_RADIUS);
    pop();
  }
  //sets the ball in motion when it's not out of bounds
  update() {
    if (this.outOfBounds() == false) {
      this.pos.add(this.velocity);
      this.velocity.add(this.acceleration);
    } else {
      if (this.fallState == false) {
        this.fallState = true;
        time = 0;
      }
      if (this.outOfBounds() == "left" || this.outOfBounds() == "middle left") {
        if (time > 100) {
          this.reset("right");
          this.fallState = false;
          player2Score++;
        }
      } else {
        if (time > 100) {
          this.reset("left");
          this.fallState = false;
          player1Score++;
        }
      }
    }
  }
  //checks when and where the ball hits the net/falls on the ground
  outOfBounds() {
    if (this.pos.x < width / 2 && this.pos.y >= height - FLOOR_COLLISION_OFFSET) {
      return "left";
    }
    if (this.pos.x > width / 2 && this.pos.y >= height - FLOOR_COLLISION_OFFSET) {
      return "right";
    }
    if (
      abs(this.pos.x - width / 2) <= NET_COLLISION_RANGE &&
      this.pos.y >= height - NET_HEIGHT_OFFSET
    ) {
      if (this.pos.x > width / 2) {
        return "middle right";
      }
      return "middle left";
    }
    return false;
  }
  //resets the position of the ball and activates the hand animation
  reset(d) {
    this.velocity.set(0, 0);
    player1.reset();
    player2.reset();
    if (d == "left") {
      this.pos.set(BALL_START_X, BALL_START_Y);
      handState = "left";
    } else {
      this.pos.set(width - BALL_START_X, BALL_START_Y);
      handState = "right";
    }
  }
}

//sets the ball's velocity to the velocity of the racquet when it hits the ball
function hit(r1, r2, b) {
  if (r1.swingState && b.hitState == true) {
    if (dist(r1.pos.x, r1.pos.y, b.pos.x, b.pos.y) < HIT_DISTANCE) {
      b.velocity.set(r1.velocity);
      b.velocity.setMag(BALL_SPEED);
      b.hitState = false;
    }
  }
  if (r2.swingState && b.hitState == true) {
    if (dist(r2.pos.x, r2.pos.y, b.pos.x, b.pos.y) < HIT_DISTANCE) {
      b.velocity.set(r2.velocity);
      b.velocity.setMag(BALL_SPEED);
      b.hitState = false;
    }
  } else if (!r2.swingState && !r1.swingState) {
    b.hitState = true;
  }
}

//hand animation when a ball is released
let t1 = 0;
let handState = "left";
function drawHand() {
  if (handState) {
    t1 += HAND_ANIMATION_STEP;
    if (handState == "left") {
      image(img4, -HAND_OFFSET_X_LEFT, -HAND_OFFSET_Y - t1);
    }
    if (handState == "right") {
      image(
        img4,
        (3 * width) / 4 - HAND_OFFSET_X_RIGHT,
        -HAND_OFFSET_Y - t1
      );
    }
    if (t1 > HAND_ANIMATION_LIMIT) {
      t1 = 0;
      handState = false;
    }
  }
}

//background animation
let z = 0;
function background1() {
  push();
  strokeWeight(scaleValue(11));
  //colorMode(HSL,100);
  for (let x = 0; x < width + 1; x += scaleValue(8)) {
    for (let y = 0; y < height + 1; y += scaleValue(8)) {
      let rand = noise(x * 1, y * 1, z * 1);
      stroke(rand * 70);
      point(x, y);
    }
  }
  z += 0.07;
  pop();
}

let player1;
let player2;
let ball1;

let player1Score = 0;
let player2Score = 0;
let time = 0;

let img1;
let img2;
let img3;
let img4;

function preload() {
  displayBasicInformation();
  img1 = loadImage("../Aristotle_vs_Giant_Robot_Octopuses/Assets/Aristotle.png");
  img2 = loadImage("../Aristotle_vs_Giant_Robot_Octopuses/Assets/Octopus.png");
  img3 = loadImage("../Aristotle_vs_Giant_Robot_Octopuses/Assets/floor.png");
  img4 = loadImage("../Aristotle_vs_Giant_Robot_Octopuses/Assets/hand.png");
}
let canvas;
function setup() {
  canvas = createCanvas(
    BASE_CANVAS_WIDTH * SCALE_FACTOR,
    BASE_CANVAS_HEIGHT * SCALE_FACTOR
  );
  canvas.parent(document.getElementById("projectContainer"));
  textStyle(BOLD);
  textAlign(CENTER);
  player1 = new racquet(RACQUET_LENGTH, PLAYER_START_LEFT_X, GROUND_Y, 1);
  player2 = new racquet(
    -RACQUET_LENGTH,
    width - PLAYER_START_RIGHT_OFFSET,
    GROUND_Y,
    2
  );
  ball1 = new ball();
  img1.resize(scaleValue(150), scaleValue(180));
  img2.resize(scaleValue(240), scaleValue(270));
  img3.resize(width, FLOOR_IMAGE_HEIGHT);
  img4.resize(img4.width * SCALE_FACTOR, img4.height * SCALE_FACTOR);
  noLoop();
}
function draw() {
  background1();
   window.addEventListener("keydown", function(e) {
  // Check if the pressed key is an arrow key or the spacebar
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight","w","a","s","d","SHIFT"].indexOf(e.code) > -1) {
    e.preventDefault(); // Prevent the default scrolling behavior
  }
}, false);
  //plays ending if a player's score reaches 7
  if (player1Score == 7) {
    push();
    fill(255, 255, 255, 90);
    textSize(WIN_TEXT_SIZE);
    text("Aristotle wins", width / 2, height / 2 - scaleValue(100));
    textSize(QUOTE_TEXT_SIZE);
    text(
      "”The octopus is a stupid creature,\n for it will approach a man's hand\n if it be lowered in the water.”",
      width / 2,
      height / 2 - scaleValue(10)
    );
    pop();
  } 
  else if (player2Score == 7) {
    push();
    fill(255, 255, 255, 90);
    textSize(WIN_TEXT_SIZE);
    text("Octopus wins", width / 2, height / 2 - scaleValue(100));
    textSize(QUOTE_TEXT_SIZE);
    text(
      "All men are mortal.\nAristotle is a man.\nTherefore, Aristotle will die.",
      width / 2,
      height / 2 - scaleValue(10)
    );
    pop();
  } 
  //otherwise, continue the gameplay
  else {
    push();
    fill(255, 255, 255, 90);
    tint(255, 127);
    image(img3, 0, FLOOR_IMAGE_Y);
    textSize(SCORE_TEXT_SIZE);
    text(player1Score, width / 4, height / 2);
    text(player2Score, (3 * width) / 4, height / 2);
    pop();
    push();
    stroke(255, 255, 255, 110);
    strokeWeight(NET_STROKE_WEIGHT);
    line(width / 2, height - NET_BASE_OFFSET, width / 2, height - NET_HEIGHT_OFFSET);
    pop();
    
    drawHand();

    player1.show();
    player1.update();
    player1.swing();
    player2.show();
    player2.update();
    player2.swing();
    ball1.show();
    ball1.update();
    hit(player1, player2, ball1);

    time++;
  }
  showHint(40);
}
