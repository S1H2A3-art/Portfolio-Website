let link = "https://teachablemachine.withgoogle.com/models/1nKjvSO4U/";
let classifier;
let myResult;

let video;

//2D-array of beads to represent the video
let beads;
//space in between each bead
let size = 10;

//controls will effects to apply to video
let mode = 0;

//current value of the intensity of effects
let offset = 0;
let flash = 0;
let inverse = 0;
let inverseThreshold = 0;
let lens = 0;
let lensAmount = [0, 0, 0];
let opacity = 0;

//target value of the intensity of effects
let targetOffset = 0;
let targetFlash = 0;
let targetInverse = 0;
let targetInverseThreshold = 0;
let targetLens = 0;
let targetOpacity = 0;

function preload() {
    displayBasicInformation();
  classifier = ml5.imageClassifier(link + "model.json");
}
let canvas;
function setup() {
  canvas = createCanvas(1400, 1400);
  canvas.parent(document.getElementById("projectContainer"));
  noLoop();
  video = createCapture(VIDEO, { flipped: true });
  video.size(700, 700);
  video.hide();

  pixelDensity(1);

  //set up 2D array of beads
  beads = new Array(700 / size);
  for (let i = 0; i < beads.length; i++) {
    beads[i] = new Array(700 / size);
  }
  for (let i = 0; i < 700; i += 1) {
    for (let j = 0; j < 700; j += size) {
      beads[j / size][i / size] = new Bead({
        x: j*2,
        y: i*2,
        rgb: [255, 255, 255],
      });
    }
  }

  classifier.classifyStart(video, getResults);
}

//stores the index of the pixel in the pixels array
let pixelNum;

function draw() {
  
  //change effect mode based on teachable machine outputs
  if (myResult) {
    console.log(myResult);
    if (myResult == "0") {
      mode = 0;
    } else if (myResult == "1") {
      mode = 1;
    } else if (myResult == "2") {
      mode = 2;
    } else if (myResult == "3") {
      mode = 3;
    } else if (myResult == "4") {
      mode = 4;
    } else if (myResult == "5") {
      mode = 5;
    }
  }
  //lens amount is a random color for the filter of each iteration
  lensAmount = [random(255), random(255), random(255)];
  
  //adjusts target effects according to mode
  if (mode == 0) {
    targetOffset = 50;
    targetFlash = 0.9;
    targetInverse = 0.2;
    targetInverseThreshold = 600;
    targetLens = 0.9;
    targetOpacity = 5;
  } else if (mode == 1) {
    targetOffset = 30;
    targetFlash = 0.98;
    targetInverse = 0.5;
    targetInverseThreshold = 400;
    targetLens = 0.9;
    targetOpacity = 7;
  } else if (mode == 2) {
    targetOffset = 20;
    targetFlash = 0.983;
    targetInverse = 0.6;
    targetInverseThreshold = 300;
    targetLens = 0.95;
    targetOpacity = 10;
  } else if (mode == 3) {
    targetOffset = 15;
    targetFlash = 0.988;
    targetInverse = 0.7;
    targetInverseThreshold = 200;
    targetLens = 0.97;
    targetOpacity = 15;
  } else if (mode == 4) {
    targetOffset = 10;
    targetFlash = 0.996;
    targetInverse = 0.89;
    targetInverseThreshold = 150;
    targetLens = 0.98;
    targetOpacity = 25;
  } else if (mode == 5) {
    targetOffset = 5;
    targetFlash = 0.999;
    targetInverse = 0.99;
    targetInverseThreshold = 50;
    targetLens = 0.999;
    targetOpacity = 55;
  }

  //update effect intensity to gradually transition them to the target values
  offset = update(offset, targetOffset, 1);
  flash = update(flash, targetFlash, 0.05);
  inverse = update(inverse, targetInverse, 0.05);
  inverseThreshold = update(inverseThreshold, targetInverseThreshold, 1);
  lens = update(lens, targetLens, 0.05);
  opacity = update(opacity, targetOpacity, 0.05);

  //update the RGB value of each bead in the 2D array of beads according to the RGB value of the pixel that each bead is on
  video.loadPixels();
  for (let j = 1; j < beads.length; j += 1) {
    for (let i = 0; i < beads[0].length; i += 1) {
      pixelNum = calculatePixel(beads[i][j].x, beads[i][j].y, 700);
      beads[i][j].updateColor([
        video.pixels[pixelNum],
        video.pixels[pixelNum + 1],
        video.pixels[pixelNum + 2],
      ]);
      //draw all beads in the bead array
      beads[i][j].show();
    }
  }
  showHint(40);
}

function getResults(result) {
  if (result && result[0]) {
    myResult = result[0].label;
  }
}

function update(current, target, velocity) {
  let difference = target - current;
  current += difference * velocity;
  return current;
}
