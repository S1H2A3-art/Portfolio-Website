let video;
let bodySegmentation;
let segmentation;

let offset = 20;
let flash = 0.98;
let inverse = 1;
let inverseThreshold = 100000;

let options = {
  maskType: "person",
};

//2D-array of beads to represent the video
let beads;
//space in between each bead
let size = 10;

function preload() {
    showMode = "key";
  displayBasicInformation();
  bodySegmentation = ml5.bodySegmentation("SelfieSegmentation", options);
}
function keyPressed(){
    
    keyPressedShow();
}
let canvas;
function setup() {

  canvas = createCanvas(1400, 1400, WEBGL);
  canvas.parent(document.getElementById("projectContainer"));

  video = createCapture(VIDEO, { flipped: false });
  video.size(800, 800);
  video.hide();

  pixelDensity(1);

  //set up 2D array of beads
  beads = new Array(800 / size);
  for (let i = 0; i < beads.length; i++) {
    beads[i] = new Array(800 / size);
  }
  for (let i = 0; i < 800; i += 1) {
    for (let j = 0; j < 800; j += size) {
      beads[j / size][i / size] = new Bead({
        x: j,
        y: i,
        z: 0,
        rgb: [255, 255, 255],
        opacity: 255,
      });
    }
  }
  bodySegmentation.detectStart(video, gotResults);
  noLoop();
  
}

//stores the index of the pixel in the pixels array
let pixelNum;

function draw() {
  background(0, 0, 0, 255);

  translate(-800 / 2, -800 / 2);

  //camera(0, 0, 250, 0, 0, 0);
  orbitControl();
  //update the RGB value of each bead in the 2D array of beads according to the RGB value of the pixel that each bead is on
  video.loadPixels();
  for (let j = 1; j < beads.length; j += 1) {
    for (let i = 0; i < beads[0].length; i += 1) {
      pixelNum = calculatePixel(beads[i][j].x, beads[i][j].y, 800);
      beads[i][j].updateColor([
        video.pixels[pixelNum],
        video.pixels[pixelNum + 1],
        video.pixels[pixelNum + 2],
      ]);
      if (segmentation) {
        beads[i][j].updatePosition(
          createVector(
            beads[i][j].x,
            beads[i][j].y,
            map(
              segmentation[
                calculateSegPixel(beads[i][j].x, beads[i][j].y, 800)
              ],
              0,
              255,
              0,
              550
            )
          )
        );
      }
      //draw all beads in the bead array
      
      beads[i][j].show();
    }
  }
  for (let i = 0; i < 5000; i++) {
    drawLine();
  }
  showHint();
}

function gotResults(result) {
  segmentation = result.data;
}

function drawLine() {
  let randRow1 = random(beads);
  let randRow2 = random(beads);
  let randPix1 = random(randRow1);
  let randPix2 = random(randRow2);
  if (
    abs(randPix1.z - randPix2.z) > 300 &&
    dist(randPix1.x, randPix1.y, randPix2.x, randPix2.y) < 150
  ) {
    push();
    stroke(
      map(abs(randPix1.z - randPix2.z), 300, 550, 50, 255),
      0,
      map(randPix1.x + randPix1.y + randPix2.x + randPix2.y, 0, 1400, 0, 100)
    );
    strokeWeight(map(abs(randPix1.z - randPix2.z), 300, 550, 0.5, 1));
    line(
      randPix1.x,
      randPix1.y,
      -randPix1.z,
      randPix2.x,
      randPix2.y,
      -randPix2.z
    );
    pop();
  }
}