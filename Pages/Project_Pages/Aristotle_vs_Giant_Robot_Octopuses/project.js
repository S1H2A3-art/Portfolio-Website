//class of player objects
class racquet {
  constructor(length, x, y, mode) {
    this.mode = mode;
    this.length = length;

    this.center = createVector(x, y);
    this.v = createVector();
    this.a = createVector();

    this.pos = createVector(this.center.x - length, this.center.y);
    this.velocity = createVector(0, 0);

    this.swingState = false;
    this.jumpState = false;
  }

  show() {
    push();

    if (this.mode == 1) {
      image(img1, this.center.x - 80, this.center.y - 120);
    } else {
      image(img2, this.center.x - 300, this.center.y - 260);
    }

    stroke(random(200, 255));
    strokeWeight(2);
    fill(random(0, 30), 200);
    line(this.pos.x, this.pos.y, this.center.x, this.center.y);
    circle(this.pos.x, this.pos.y, 70);
    circle(this.center.x, this.center.y, 2);

    pop();
  }

  swing() {
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
      this.velocity.setMag(14);
      this.pos.add(this.velocity);

      if (this.mode == 1) {
        if (this.pos.x > this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.jumpState = false;
          this.center.set(this.center.x, 600);
          this.pos.set(this.center.x - this.length, 600);
        }
      } else {
        if (this.pos.x < this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.jumpState = false;
          this.center.set(this.center.x, 600);
          this.pos.set(this.center.x - this.length, 600);
        }
      }
    }
  }

  outOfBounds() {
    if (this.mode == 1) {
      if (this.pos.x < 35) {
        return "left";
      } else if (this.center.x > width / 2 - 160) {
        return "right";
      }
      return false;
    }
    if (this.mode == 2) {
      if (this.pos.x > width - 35) {
        return "right";
      } else if (this.center.x < width / 2 + 160) {
        return "left";
      }
      return false;
    }
  }

  reset() {
    this.swingState = false;
    this.jumpState = false;
    if (this.mode == 1) {
      this.center.set(400, 600);
    } else {
      this.center.set(width - 400, 600);
    }
  }

  jump() {
    if (this.jumpState) {
      this.v.add(this.a);
      this.center.add(this.v);

      if (this.center.y == 600) {
        this.jumpState = false;
      }
    }

    if (this.mode == 1) {
      if (keyIsDown(UP_ARROW) && this.center.y == 600) {
        this.jumpState = true;
        this.v.set(0, -30);
        this.a.set(0, 2);
      }
    } else {
      if (keyIsDown(87) && this.center.y == 600) {
        this.jumpState = true;
        this.v.set(0, -30);
        this.a.set(0, 2);
      }
    }
  }

  update() {
    if (this.mode == 1) {
      if (keyIsDown(13) == true) {
        this.swingState = true;
      }

      if (this.swingState == false) {
        this.jump();
        if (keyIsDown(LEFT_ARROW) && this.outOfBounds() != "left") {
          this.center.x -= 10;
        }
        if (keyIsDown(RIGHT_ARROW) && this.outOfBounds() != "right") {
          this.center.x += 10;
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
          this.center.x -= 10;
        }
        if (keyIsDown(68) && this.outOfBounds() != "right") {
          this.center.x += 10;
        }

        this.pos.set(this.center.x - this.length, this.center.y);
      }
    }
  }
}

class AIRacquet {
  constructor(length, x, y, mode, brain) {
    this.mode = mode;
    this.length = length;
    this.win = false;

    this.center = createVector(x, y);
    this.v = createVector();
    this.a = createVector();

    this.pos = createVector(this.center.x - length, this.center.y);
    this.velocity = createVector(0, 0);

    this.swingState = false;
    this.jumpState = false;
    this.swingCooldown = 0;

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork({
        inputs: 9,
        outputs: ["left", "right", "jump", "swing"],
        task: "classification",
        neuroEvolution: true,
      });
    }

    this.fitness = 0;
    this.alive = true;
    this.lastX = this.center.x;
    this.idleFrames = 0;
    this.lastDistanceToBall = null;
  }

  think(ball) {
    this.fitnessReward(ball);
    if (this.swingCooldown > 0) this.swingCooldown--;

    if (ball.velocity.x > 0 || (ball.velocity.x == 0 && ball.pos.x >= width / 2)) {
      let relativeX = (ball.pos.x - this.center.x) / width;
      let relativeY = (ball.pos.y - this.center.y) / height;
      let relVelocityX = ball.velocity.x / 6.0;
      let relVelocityY = ball.velocity.y / 6.0;
      let distance = dist(ball.pos.x, ball.pos.y, this.center.x, this.center.y) / width;
      let directionToBall = Math.sign(ball.pos.x - this.center.x);
      let timeEstimate = abs(ball.pos.y - this.center.y) / max(0.1, abs(ball.velocity.y));

      let inputs = [
        relativeX,
        relativeY,
        relVelocityX,
        relVelocityY,
        distance,
        directionToBall,
        timeEstimate / 100,
        this.swingState ? 1 : 0,
        this.jumpState ? 1 : 0,
      ];

      let results = this.brain.classifySync(inputs);

      if (results[0].label === "swing" && this.swingCooldown === 0) {
        this.swingState = true;
      }
      if (this.swingState == false) {
        this.jump();
        if ((results[0].label === "left" || results[1].label === "left") && this.outOfBounds() != "left") {
          this.center.x -= 10;
        }
        if ((results[0].label === "right" || results[1].label === "right") && this.outOfBounds() != "right") {
          this.center.x += 10;
        }
        if (results[0].label === "jump" || results[1].label === "jump") {
          this.jumpState = true;
        }

        this.pos.set(this.center.x - this.length, this.center.y);
      }
    }
  }

  fitnessReward(ball) {
    this.fitness += 0.1;
    let distNow = dist(this.center.x, this.center.y, ball.pos.x, ball.pos.y);
    if (this.lastDistanceToBall != null) {
      let delta = this.lastDistanceToBall - distNow;
      if (delta > 0) this.fitness += delta * 6;
      else this.fitness += delta * 1.5;
    }
    this.lastDistanceToBall = distNow;
    let move = abs(this.center.x - this.lastX);
    if (move > 4) {
      this.fitness += move * 0.2;
      this.idleFrames = 0;
    } else {
      this.idleFrames++;
      if (this.idleFrames > 50) {
        this.fitness -= 3;
        this.idleFrames = 0;
      }
    }
    this.lastX = this.center.x;

    let horizontalProximity = abs(ball.pos.x - this.center.x);
    if (horizontalProximity < 240) this.fitness += (240 - horizontalProximity) * 0.05;

    let verticalProximity = abs(ball.pos.y - this.center.y);
    if (this.swingState && horizontalProximity < 120 && verticalProximity < 80)
      this.fitness += 15;

    if (this.jumpState && distNow > 500) this.fitness -= 10;

    if (this.win) this.fitness += 200;

    if (!this.alive) this.fitness -= 20;

    if (ball.hitState === false && horizontalProximity < 60) this.fitness += 45;
  }

  show() {
    push();
    if (this.mode == 1) {
      image(img1, this.center.x - 80, this.center.y - 120);
    } else {
      image(img2, this.center.x - 300, this.center.y - 260);
    }
    stroke(random(200, 255));
    strokeWeight(2);
    fill(random(0, 30), 200);
    line(this.pos.x, this.pos.y, this.center.x, this.center.y);
    circle(this.pos.x, this.pos.y, 70);
    circle(this.center.x, this.center.y, 2);
    pop();
  }

  swing() {
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
      this.velocity.setMag(16);
      this.pos.add(this.velocity);

      if (this.mode == 1) {
        if (this.pos.x > this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.jumpState = false;
          this.swingCooldown = 120;
          this.center.set(this.center.x, 600);
          this.pos.set(this.center.x - this.length, 600);
        }
      } else {
        if (this.pos.x < this.center.x + this.length) {
          this.pos.set(this.center.x - this.length, this.center.y);
          this.swingState = false;
          this.swingCooldown = 120;
          if (this.center.y >= 600) {
            this.jumpState = false;
            this.center.y = 600;
            this.v.set(0, 0);
            this.a.set(0, 0);
          }
          this.pos.set(this.center.x - this.length, this.center.y);
        }
      }
    }
  }

  outOfBounds() {
    if (this.mode == 1) {
      if (this.pos.x < 35) return "left";
      else if (this.center.x > width / 2 - 160) return "right";
      return false;
    }
    if (this.mode == 2) {
      if (this.pos.x > width - 35) return "right";
      else if (this.center.x < width / 2 + 160) return "left";
      return false;
    }
  }

  reset() {
    this.swingState = false;
    this.jumpState = false;
    this.center.set(width - 400, 600);
    this.pos.set(this.center.x - this.length, this.center.y);
  }

  jump() {
    if (this.jumpState && abs(this.center.y - 600) < 1 && this.v.mag() === 0) {
      this.v.set(0, -30);
      this.a.set(0, 2);
    }

    if (this.jumpState) {
      this.v.add(this.a);
      this.center.add(this.v);

      if (this.center.y >= 600) {
        this.center.y = 600;
        this.jumpState = false;
        this.v.set(0, 0);
        this.a.set(0, 0);
      }
    }
  }
}

class ball {
  constructor() {
    this.pos = createVector(300, 200);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0.1);
    this.hitState = false;
    this.fallState = false;
  }

  show() {
    push();
    noStroke();
    fill(random(150, 255), random(150, 255), random(150, 255));
    circle(this.pos.x, this.pos.y, 20);
    pop();
  }

  update(player1, player2) {
    if (this.outOfBounds() == false) {
      this.pos.add(this.velocity);
      this.velocity.add(this.acceleration);
    } else {
      if (this.fallState == false) {
        this.fallState = true;
        time = 0;
      }
      if (this.outOfBounds() == "left" || this.outOfBounds() == "middle left") {
        if (time > 200) {
          this.reset("right", player1, player2);
          this.fallState = false;
          player2.win = true;
        }
      } else {
        if (time > 200) {
          this.reset("left", player1, player2);
          this.fallState = false;
          player2.alive = false;
        }
      }
    }
  }

  outOfBounds() {
    if (this.pos.x < width / 2 && this.pos.y >= height - 40) return "left";
    if (this.pos.x > width / 2 && this.pos.y >= height - 40) return "right";
    if (abs(this.pos.x - width / 2) <= 10 && this.pos.y >= height - 300) {
      if (this.pos.x > width / 2) return "middle right";
      return "middle left";
    }
    return false;
  }

  reset(d, player1, player2) {
    this.velocity.set(0, 0);
    player2.reset();
    if (d == "left") {
      this.pos.set(300, 200);
    } else {
      this.pos.set(width - 300, 200);
    }
  }
}

let populationSize = 20;
let AIRacquets = [];
let Balls = [];

function hit(r1, r2, b) {
  if (r1.swingState && b.hitState == true) {
    if (dist(r1.pos.x, r1.pos.y, b.pos.x, b.pos.y) < 60) {
      b.velocity.set(r1.velocity);
      b.velocity.setMag(random(10, 12));
      b.hitState = false;
    }
  }
  if (r2.swingState && b.hitState == true) {
    if (dist(r2.pos.x, r2.pos.y, b.pos.x, b.pos.y) < 60) {
      b.velocity.set(r2.velocity);
      b.velocity.setMag(10);
      b.hitState = false;
    }
  } else if (!r2.swingState && !r1.swingState) {
    b.hitState = true;
  }
}

let t1 = 0;
let handState = "left";
function drawHand() {
  if (handState) {
    t1 += 4;
    image(img4, -50, -200 - t1);
    if (t1 > 250) {
      t1 = 0;
      handState = false;
    }
  }
}

let z = 0;
function background1() {
  push();
  strokeWeight(14);
  for (let x = 0; x < width + 1; x += 16) {
    for (let y = 0; y < height + 1; y += 16) {
      let rand = noise(x * 1, y * 1, z * 1);
      stroke(rand * 90, 20, 20);
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
let iteration = 0;

function preload() {     
  displayBasicInformation();
  img1 = loadImage("Assets/Aristotle.png");
  img2 = loadImage("Assets/Octopus.png");
  img3 = loadImage("Assets/floor.png");
  img4 = loadImage("Assets/hand.png");

}

let canvas;

function setup(){

  
  canvas = createCanvas(2000, 800);
  canvas.parent(document.getElementById("projectContainer"));

  ml5.setBackend("cpu");
  textStyle(BOLD);
  textAlign(CENTER);
  player1 = new racquet(100, 400, 600, 1);
  for (let i = 0; i < populationSize; i++) {
    AIRacquets.push(new AIRacquet(-100, width - 400, 600, 2));
    Balls.push(new ball());
  }

  img1.resize(300, 360);
  img2.resize(480, 540);
  img3.resize(width, 160);
  
  noLoop();
}
function draw() {

  background(0);
  background1();
    window.addEventListener("keydown", function(e) {
  // Check if the pressed key is an arrow key or the spacebar
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault(); // Prevent the default scrolling behavior
  }
}, false);
  if (player1Score == 7) {
    push();
    fill(255, 255, 255, 90);
    textSize(140);
    text("Aristotle wins", width / 2, height / 2 - 200);
    textSize(80);
    text(
      "”The octopus is a stupid creature,\n for it will approach a man's hand\n if it be lowered in the water.”",
      width / 2,
      height / 2 - 20
    );
    pop();
  } else if (player2Score == 7) {
    push();
    fill(255, 255, 255, 90);
    textSize(140);
    text("Octopus wins", width / 2, height / 2 - 200);
    textSize(80);
    text(
      "All men are mortal.\nAristotle is a man.\nTherefore, Aristotle will die.",
      width / 2,
      height / 2 - 20
    );
    pop();
  } else {
    push();
    fill(255, 255, 255, 90);
    tint(255, 127);
    image(img3, 0, 760);
    textSize(180);
    text(iteration, width / 2, height / 4);
    pop();

    push();
    stroke(255, 255, 255, 110);
    strokeWeight(8);
    line(width / 2, height - 30, width / 2, height - 300);
    pop();

    drawHand();

    player1.update();
    player1.swing();
    player1.show();

    for (let i = 0; i < populationSize; i++) {
      if (AIRacquets[i].alive) {
        AIRacquets[i].show();
        AIRacquets[i].think(Balls[i]);
        AIRacquets[i].swing();

        Balls[i].show();
        Balls[i].update(player1, AIRacquets[i]);
        hit(player1, AIRacquets[i], Balls[i]);
        if (Balls[i].velocity.x == 0 && Balls[i].pos.x >= width / 2) {
          AIRacquets[i].alive = false;
        }
      }
    }

    if (allAIDead()) {
      normalizeFitness();
      reproduction();
    }

    time++;
    showHint(40); // doubled hint display position
  }
}

function allAIDead() {
  for (let AI of AIRacquets) {
    if (AI.alive) {
      return false;
    }
  }
  return true;
}

function normalizeFitness() {
  let sum = 0;
  for (let ai of AIRacquets) sum += ai.fitness;
  for (let ai of AIRacquets) {
    ai.fitness = ai.fitness / sum;
  }
}

function weightedSelection() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r -= AIRacquets[index].fitness;
    index++;
    if (index >= AIRacquets.length) index = AIRacquets.length - 1;
  }
  index--;
  return AIRacquets[index].brain;
}

function reproduction() {
  handState = true;
  iteration++;

  AIRacquets.sort((a, b) => b.fitness - a.fitness);
  const eliteCount = 5;
  const elites = AIRacquets.slice(0, eliteCount);
  const nextAIs = [];

  for (let i = 0; i < eliteCount; i++) {
    let eliteBrain = elites[i].brain;
    nextAIs.push(new AIRacquet(-100, width - 400, 600, 2, eliteBrain));
  }

  let mutationRate = map(iteration, 0, 100, 0.3, 0.01, true);

  for (let i = eliteCount; i < populationSize; i++) {
    let parentA = weightedSelection();
    let parentB = weightedSelection();

    let child = parentA.crossover(parentB);
    child.mutate(mutationRate);

    if (random() < 0.03) {
      child = ml5.neuralNetwork({
        inputs: 9,
        outputs: ["left", "right", "jump", "swing"],
        task: "classification",
        neuroEvolution: true,
      });
    }

    nextAIs.push(new AIRacquet(-100, width - 400, 600, 2, child));
  }

  AIRacquets = nextAIs;

  Balls = [];
  for (let i = 0; i < populationSize; i++) Balls.push(new ball());
}

