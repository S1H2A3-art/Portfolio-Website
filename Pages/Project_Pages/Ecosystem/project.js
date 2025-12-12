//green stationary tiles that provide food for the preys
class vegetation {
  constructor(x, y) {
    this.food = 10;
    this.pos = createVector(x,y);
  }
  drawShape() {
    push();
    fill(0, 8.5 * this.food, 7.9 * this.food);
    strokeWeight(0.3);
    stroke(255, 255, 255, 100);
    square(this.pos.x, this.pos.y, 20);
    pop();
  }
  //regenerates food
  grow() {
    if (this.food <= 10) {
      this.food += 0.6;
    }
  }
}
//tiny multicolored particles that feed on vegetations and provide food for the predators
class prey {
  constructor(x, y, r, g, b) {
    this.pos = createVector(x,y);
    this.r = r;
    this.g = g;
    this.b = b;
    this.hunger = 2;
    this.velocity = createVector(0,0);
  } 
  //feed on the vegetation tile that it is on
  eat() {
    if (
      vegetations[locate(this.pos.x, this.pos.y)[0]][locate(this.pos.x, this.pos.y)[1]].food > 0
    ) {
      vegetations[locate(this.pos.x, this.pos.y)[0]][
        locate(this.pos.x, this.pos.y)[1]
      ].food -= 0.5;

      this.hunger += 1;
    }
  }
  die() {
    this.hunger = 0;
  }
  //color of its babies are determined by its color but also deviating from them
  reproduce() {
    if (random(1) > 0.987) {
      preys[preys.length] = new prey(
        this.pos.x,
        this.pos.y,
        randomGaussian(this.r, 10),
        randomGaussian(this.g, 10),
        randomGaussian(this.b, 10)
      );
    }
  }
  move() { 
    let acceleration = createVector(randomGaussian(0, 0.3),randomGaussian(0, 0.3));
    acceleration.rotate(random(2*PI));
    this.velocity.add(acceleration);
    this.velocity.limit(1);
    this.pos.add(this.velocity);
    if(this.pos.x < 0){
      this.pos.x = width + this.pos.x;
    }
    if(this.pos.x > width){
      this.pos.x = this.pos.x - width;
    }
    if(this.pos.y < 0){
      this.pos.y = height + this.pos.y;
    }
    if(this.pos.y > height){
      this.pos.y = this.pos.y - height;
    }
    this.hunger--;
  }
  drawShape() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.pos.x, this.pos.y, 5);
  }
}
//small multicolored circles that feed on preys 
class predator {
  constructor(x, y, r, g, b) {
    this.pos = createVector(x,y);
    this.velocity = createVector(0,0);
    this.r = r;
    this.g = g;
    this.b = b;
    this.hunger = 70;
  }
  reproduce() {
    if (this.hunger >= 80) {
      if (random(1) > 0.998) {
        predators.push(new predator(this.pos.x, this.pos.y, this.r, this.g, this.b));
      }
    }
  }
  move() {
    let acceleration = createVector(randomGaussian(0,0.5),randomGaussian(0,0.5));
    this.velocity.add(acceleration);
    this.pos.add(this.velocity);
    acceleration.rotate(random(2*PI));
    this.velocity.limit(1.3);
    
    if(this.pos.x < 0){
      this.pos.x = width + this.pos.x;
    }
    if(this.pos.x > width){
      this.pos.x = this.pos.x - width;
    }
    if(this.pos.y < 0){
      this.pos.y = height + this.pos.y;
    }
    if(this.pos.y > height){
      this.pos.y = this.pos.y - height;
    }
    
    //consumes the preys that it touches
    for (let i = 0; i < preys.length; i++) {
      if (dist(preys[i].pos.x, preys[i].pos.y, this.pos.x, this.pos.y) < 20) {
        preys[i].die();
        if (this.hunger < 100) {
          this.hunger += 10;
        }
        //color of the predators are determined by the color of the preys they consume
        if (preys[i].r > preys[i].g && preys[i].r > preys[i].b) {
          if (this.r < 255) {
            this.r += 3;
          }
          if (random(1) > 0.5 && this.g > 0) {
            this.g -= 3;
          } else if (this.b > 0) {
            this.b -= 3;
          }
        } else if (preys[i].g > preys[i].r && preys[i].g > preys[i].b) {
          if (this.g < 255) {
            this.g += 3;
          }
          if (random(1) > 0.5 && this.b > 0) {
            this.b -= 3;
          } else if (this.r > 0) {
            this.r -= 3;
          }
        } else {
          if (this.b < 255) {
            this.b += 3;
          }
          if (random(1) > 0.5 && this.g > 0) {
            this.g -= 3;
          } else if (this.r > 0) {
            this.r -= 3;
          }
        }
      }
    }
    this.hunger -= 0.15;
  }
  drawShape() {
    stroke("white");
    strokeWeight(0.2);
    fill(this.r, this.g, this.b);
    circle(this.pos.x, this.pos.y, 20);
  }
}


//returns the index of the tile given the position of a prey
function locate(x, y) {
  let posX = floor(x / 20);
  let posY = floor(y / 20);
  return [posX, posY];
}

//array of objects
let vegetations = [];
let preys = [];
let predators = [];

//checks the first time when the population of preys reaches 50 
let pred = false;

//variable used to check each prey in the array in a while loop
let index = 0;
//variable used to check each predator in the arry in a while loop
let index2 = 0;
let img = [];
async function preload1(){
    await displayBasicInformation();
}
let canvas1;
async function setup1() {
  await preload1();
  
  canvas1 = createCanvas(1400, 1400);
  canvas1.parent(document.getElementById("projectContainer"));
  
  //creates the first prey object
  preys[0] = new prey(width / 2, height / 2, 255, 255, 255);

  //create the vegetation objects
  for (let i = 0; i <= width; i += 20) {
    vegetations[i / 20] = [];
    for (let j = 0; j <= height; j += 20) {
      vegetations[i / 20][j / 20] = new vegetation(i, j);
    }
  }
  
  textSize(20);
  noLoop();
  
}
async function draw() {
  if(frameCount==1){
    await setup1();
    return;
  }
  
  //run the functions of the vegetation class for each vegetation object
  for (let i = 0; i < vegetations.length; i++) {
    for (let j = 0; j < vegetations[i].length; j++) {
      vegetations[i][j].drawShape();
      vegetations[i][j].grow();
    }
  }

   //run the functions of the prey class for each prey object and remove prey objects that are dead from the array
  while (index < preys.length) {
    if (preys[index].hunger == 0) {
      preys.splice(index, 1);
      index--;
    } else {
      preys[index].move();
      preys[index].drawShape();
      preys[index].reproduce();
      preys[index].eat();
    }
    index++;
  }
  index = 0;

    //run the functions of the predator class for each predator object and remove predator objects that are dead from the array
  while (index2 < predators.length) {
    if (predators[index2].hunger < 0) {
      predators.splice(index2, 1);
      index2--;
    } else {
      predators[index2].move();
      predators[index2].drawShape();
      predators[index2].reproduce();
    }
    index2++;
  }
  index2 = 0;

  //check when population reaches 50 for the first time
  if (preys.length > 50) {
    pred = true;
  }
  //create a new predator object if the prey population has reached 50 and when there are no predator objects that are alive
  if (pred) {
    if (predators.length == 0) {
      if (random(1) > 0.993) {
        predators.push(new predator(preys[0].pos.x, preys[0].pos.y, 0, 0, 0));
      }
    }
  }
  
  //display the population of the preys and the predators and their ratio
  push();
  fill(255,255,255,100);
  rect(0, 0, 250*2, 30*2);
  pop();
  fill("black");
  text("Prey: " + preys.length, 5*2, 20*2);
  text("Predator: " + predators.length, 80*2, 20*2);
  text("Ratio: 1:" + floor(preys.length / predators.length), 160*2, 20*2);
  showHint(40);
}
