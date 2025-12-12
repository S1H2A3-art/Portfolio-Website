//each bead represents a pixel on the image
class Bead {
  constructor({ x, y, rgb, vx, vy } = {}) {
    this.vx = vx;
    this.vy = vy;
    if (vx === undefined) {
      let vel = p5.Vector.fromAngle(random(PI), random(size / 2));
      vx = vel.x;
      vy = vel.y;
    }
    this.velocity = createVector(this.vx, this.vy);
    this.position = createVector(x, y);
    this.rgb = rgb;
    this.diameter = 46;
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get radius() {
    return this.diameter / 2;
  }

  show() {
    push();
    strokeWeight(this.diameter);
    stroke(this.rgb[0], this.rgb[1], this.rgb[2], 7);
    point(this.position.x, this.position.y);
    pop();
  }
  update() {
    this.velocity.limit(4);
    this.position.add(this.velocity);
  }

  bounceFrom(other, factor = 0.01) {
    if (this === other) return;
    let direction = createVector(this.x - other.x, this.y - other.y);
    let d = direction.mag();
    let D = this.radius + other.radius;
    if (d > D) return;
    let force = p5.Vector.fromAngle(direction.heading());
    force.setMag(factor * (this.mass + other.mass) * map(d, 0, D, 1, 0));
    this.velocity.add(force);
  }
}
function comeBack(b, strength = 0.01, frame = 0) {
  let [left, right, top, bottom] = [
    frame,
    width - frame,
    frame,
    height - frame,
  ];

  if (b.x < left) b.velocity.add((left - b.x) * strength, 0);
  if (b.x > right) b.velocity.add((right - b.x) * strength, 0);
  if (b.y < top) b.velocity.add(0, (top - b.y) * strength);
  if (b.y > bottom) b.velocity.add(0, (bottom - b.y) * strength);
}

let img1;
//select the image to apply the effects to
function preload() {
    displayBasicInformation();
  img1 = loadImage("Assets/img1.gif");
 

}

//index variable that navigates through the array of pixels
let pixelNum = 0;

//size of each bead, determines the number of beads on the screen
let size = 40;

//array of beads
let beads;

let button1;
let button2;
let button3;
let button4;

let canvas;
function setup() {
  //initialize buttons
  button1 = createButton("pixelate", "pixelate");
  button2 = createButton("wash", "wash");
  button3 = createButton("flow", "flow");
  button4 = createButton("reset", "reset");
  button1.parent(document.getElementById("controls"));
  button2.parent(document.getElementById("controls"));
  button3.parent(document.getElementById("controls"));
  button4.parent(document.getElementById("controls"));
  button1.mousePressed(buttonPressed);
  button2.mousePressed(buttonPressed);
  button3.mousePressed(buttonPressed);
  button4.mousePressed(buttonPressed);
  button1.style("font-size","2rem")
  button2.style("font-size","2rem")
  button3.style("font-size","2rem")
  button4.style("font-size","2rem")
  button1.style("width", "23%");
  button1.style("color", "orange");
  button1.style("background-color", "white");
  button1.style("border", "0.2rem solid orange");
  button1.style("margin", "0.5rem");
  button1.style("padding", "1em");
  button2.style("color", "steelblue");
  button2.style("background-color", "white");
  button2.style("margin", "0.5rem");
  button2.style("padding", "1em");
  button2.style("width", "23%");
  button2.style("border", "0.2rem solid steelblue");
  button3.style("border", "0.2rem solid navy");
  button3.style("color", "navy");
  button3.style("background-color", "white");
  button3.style("padding", "1em");
  button3.style("margin", "0.5rem");
  button3.style("width", "23%");
  button4.style("color", "white");
  button4.style("background-color", "red");
  button4.style("padding", "1em");
  button4.style("width", "23%");
  button4.style("margin", "0.5rem");

  //initialize the selected image and the pixels array
  pixelDensity(1);
  canvas = createCanvas(1000, 1000);
  canvas.parent(document.getElementById("controls"))
  image(img1, 0, 0, width, height);
  loadPixels();
  
  //set each bead to correspond to a pixel
  beads = new Array(height / size);
  for (let i = 0; i < beads.length; i++) {
    beads[i] = new Array(width / size);
  }


  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += size) {
      beads[j / size][i / size] = new Bead({
        x: j,
        y: i,
        rgb: [pixels[pixelNum], pixels[pixelNum + 1], pixels[pixelNum + 2]],
      });
      pixelNum += 4 * size;
    }
  }
}

//buttons change the effects applied to the selected image
function buttonPressed() {
  mode = this.value();
}

//mode determines the effect that is currently being applied to the image
let mode;
function draw() {
    showHint();
  //don't do anything if no effects are applied
  if (mode == undefined) {
  }
  //wash effect
  else if (mode == "wash") {
    for (let i = 0; i < beads.length; i++) {
      for (let j = 0; j < beads[i].length; j++) {
        beads[i][j].show();
        beads[i][j].update();
        for (let ii = 0; ii < beads.length; ii++) {
          for (let jj = 0; jj < beads[i].length; jj++) {
            beads[i][j].bounceFrom(beads[ii][jj]);
          }
        }
        comeBack(beads[i][j]);
      }
    }
  }
  //flow effect
  else if (mode == "flow") {
    background(255, 255, 255, 5);
    for (let i = 0; i < beads.length; i++) {
      for (let j = 0; j < beads[i].length; j++) {
        beads[i][j].velocity.set(0, random(0, 10));
        beads[i][j].show();
        beads[i][j].update();

        comeBack(beads[i][j]);
      }
    }
  }
  //pixelate effect
  else if (mode == "pixelate") {
    for (let i = 0; i < beads.length; i++) {
      for (let j = 0; j < beads[i].length; j++) {
        beads[i][j].show();
        beads[i][j].update();
        beads[i][j].velocity.set(random(-1, 1), random(-1, 1));

        for (let ii = 0; ii < beads.length; ii++) {
          for (let jj = 0; jj < beads[i].length; jj++) {
            beads[i][j].bounceFrom(beads[ii][jj]);
          }
        }
        comeBack(beads[i][j]);
      }
    }
  }
  //resets position of beads and the image
  else if (mode == "reset") {
    image(img1, 0, 0, width, height);
    updatePixels();
    pixelNum = 0;
    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += size) {
        beads[j / size][i / size] = new Bead({
          x: j,
          y: i,
          rgb: [pixels[pixelNum], pixels[pixelNum + 1], pixels[pixelNum + 2]],
        });
        pixelNum += 4 * size;
      }
    }
    mode = undefined;
  }
}
