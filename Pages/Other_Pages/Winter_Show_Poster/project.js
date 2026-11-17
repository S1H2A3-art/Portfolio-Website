let video;
let bodySegmentation;
let segmentation;

let offset = 20;
let flash = 0.98;
let inverse = 1;
let inverseThreshold = 100000;

let options = {
  maskType: "parts",
};

//2D-array of beads to represent the video
let beads;
//space in between each bead
let size = 10;

let imaLogo;
let lowResLogo;
let tischLogo;
let showTitle;
let qrCode;
let info;
function preload() {
  bodySegmentation = ml5.bodySegmentation("BodyPix", options);
  imaLogo = loadImage("assets/ima.png");
  lowResLogo = loadImage("assets/lowres.png");
  tischLogo = loadImage("assets/ColorTischLogo.png");
  showTitle = loadImage("assets/showtitle.png");
  qrCode = loadImage("assets/qrcode.png");
  info = loadImage("assets/information.png");
}

let canvas;
let dimension = 1000;
let textPoints = [];
let textPoints2 = [];
let textPoints3 = [];
function gotResults(result) {
  segmentation = result.data;
}




function setup() {
  
  canvas = createCanvas(1100, 1500, WEBGL);
  canvas.parent(document.getElementById("projectContainer"));

  video = createCapture(VIDEO, { flipped: false});
  video.size(dimension, dimension);
  video.hide();

  pixelDensity(1);

  //set up 2D array of beads
  beads = new Array(dimension / size);
  for (let i = 0; i < beads.length; i++) {
    beads[i] = new Array(dimension / size);
  }
  for (let i = 0; i < dimension; i += 1) {
    for (let j = 0; j < dimension; j += size) {
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

  




textPoints = [
  // C
  {x:-50,y:-70},{x:-30,y:-70},{x:-10,y:-70},{x:10,y:-70},
  {x:-70,y:-50},{x:-70,y:-30},{x:-70,y:-10},
  {x:-70,y:10},{x:-70,y:30},{x:-70,y:50},
  {x:-50,y:70},{x:-30,y:70},{x:-10,y:70},{x:10,y:70},

  // R
  {x:70,y:-70},{x:90,y:-70},{x:110,y:-70},{x:130,y:-70},
  {x:70,y:-50},{x:130,y:-50},
  {x:70,y:-30},{x:130,y:-30},
  {x:70,y:-10},{x:90,y:-10},{x:110,y:-10},{x:130,y:-10},
  {x:70,y:10},{x:110,y:10},
  {x:70,y:30},{x:130,y:30},
  {x:70,y:50},{x:130,y:50},
  {x:70,y:70},{x:130,y:70},

  // E
  {x:190,y:-70},{x:210,y:-70},{x:230,y:-70},{x:250,y:-70},
  {x:190,y:-50},
  {x:190,y:-30},
  {x:190,y:-10},{x:210,y:-10},{x:230,y:-10},{x:250,y:-10},
  {x:190,y:10},
  {x:190,y:30},
  {x:190,y:50},
  {x:190,y:70},{x:210,y:70},{x:230,y:70},{x:250,y:70},

  // A
  {x:330,y:-70},{x:350,y:-70},{x:370,y:-70},
  {x:310,y:-50},{x:390,y:-50},
  {x:310,y:-30},{x:390,y:-30},
  {x:310,y:-10},{x:390,y:-10},
  {x:310,y:10},{x:330,y:10},{x:350,y:10},{x:370,y:10},{x:390,y:10},
  {x:310,y:30},{x:390,y:30},
  {x:310,y:50},{x:390,y:50},
  {x:310,y:70},{x:390,y:70},

  // T
  {x:450,y:-70},{x:470,y:-70},{x:490,y:-70},{x:510,y:-70},{x:530,y:-70},
  {x:490,y:-50},{x:490,y:-30},{x:490,y:-10},
  {x:490,y:10},{x:490,y:30},{x:490,y:50},{x:490,y:70},

  // E
  {x:590,y:-70},{x:610,y:-70},{x:630,y:-70},{x:650,y:-70},
  {x:590,y:-50},
  {x:590,y:-30},
  {x:590,y:-10},{x:610,y:-10},{x:630,y:-10},{x:650,y:-10},
  {x:590,y:10},
  {x:590,y:30},
  {x:590,y:50},
  {x:590,y:70},{x:610,y:70},{x:630,y:70},{x:650,y:70}
];

textPoints2 = [
  // I
  {x:-350,y:-70},{x:-330,y:-70},{x:-310,y:-70},{x:-290,y:-70},{x:-270,y:-70},
  {x:-310,y:-50},{x:-310,y:-30},{x:-310,y:-10},{x:-310,y:10},{x:-310,y:30},{x:-310,y:50},
  {x:-350,y:70},{x:-330,y:70},{x:-310,y:70},{x:-290,y:70},{x:-270,y:70},

  // N
  {x:-230,y:-70},{x:-230,y:-50},{x:-230,y:-30},{x:-230,y:-10},{x:-230,y:10},{x:-230,y:30},{x:-230,y:50},{x:-230,y:70},
  {x:-210,y:-50},{x:-190,y:-30},{x:-170,y:-10},{x:-150,y:10},{x:-130,y:30},{x:-130,y:50},{x:-130,y:70},
  {x:-130,y:-70},{x:-130,y:-50},

  // T
  {x:-90,y:-70},{x:-70,y:-70},{x:-50,y:-70},{x:-30,y:-70},{x:-10,y:-70},
  {x:-50,y:-50},{x:-50,y:-30},{x:-50,y:-10},{x:-50,y:10},{x:-50,y:30},{x:-50,y:50},{x:-50,y:70},

  // E
  {x:30,y:-70},{x:50,y:-70},{x:70,y:-70},{x:90,y:-70},
  {x:30,y:-50},{x:30,y:-30},
  {x:30,y:-10},{x:50,y:-10},{x:70,y:-10},{x:90,y:-10},
  {x:30,y:10},{x:30,y:30},{x:30,y:50},
  {x:30,y:70},{x:50,y:70},{x:70,y:70},{x:90,y:70},

  // R
  {x:130,y:-70},{x:150,y:-70},{x:170,y:-70},{x:190,y:-70},
  {x:130,y:-50},{x:190,y:-50},
  {x:130,y:-30},{x:190,y:-30},
  {x:130,y:-10},{x:150,y:-10},{x:170,y:-10},{x:190,y:-10},
  {x:130,y:10},{x:170,y:10},
  {x:130,y:30},{x:190,y:30},
  {x:130,y:50},{x:190,y:50},
  {x:130,y:70},{x:190,y:70},

  // A
  {x:270,y:-70},{x:290,y:-70},{x:310,y:-70},
  {x:250,y:-50},{x:330,y:-50},
  {x:250,y:-30},{x:330,y:-30},
  {x:250,y:-10},{x:330,y:-10},
  {x:250,y:10},{x:270,y:10},{x:290,y:10},{x:310,y:10},{x:330,y:10},
  {x:250,y:30},{x:330,y:30},
  {x:250,y:50},{x:330,y:50},
  {x:250,y:70},{x:330,y:70},

  // C
  {x:410,y:-70},{x:430,y:-70},{x:450,y:-70},{x:470,y:-70},
  {x:390,y:-50},{x:390,y:-30},{x:390,y:-10},
  {x:390,y:10},{x:390,y:30},{x:390,y:50},
  {x:410,y:70},{x:430,y:70},{x:450,y:70},{x:470,y:70},

  // T
  {x:510,y:-70},{x:530,y:-70},{x:550,y:-70},{x:570,y:-70},{x:590,y:-70},
  {x:550,y:-50},{x:550,y:-30},{x:550,y:-10},{x:550,y:10},{x:550,y:30},{x:550,y:50},{x:550,y:70}
];

textPoints3 = [
   // I
  {x:-180,y:-30},{x:-160,y:-30},{x:-140,y:-30},
  {x:-160,y:-10},{x:-160,y:10},
  {x:-180,y:30},{x:-160,y:30},{x:-140,y:30},

  // M
  {x:-120,y:-30},{x:-120,y:-10},{x:-120,y:10},{x:-120,y:30},
  {x:-100,y:-10},{x:-80,y:-30},
  {x:-80,y:-10},{x:-80,y:10},{x:-80,y:30},

  // A
  {x:-50,y:-30},{x:-30,y:-30},
  {x:-60,y:-10},{x:-20,y:-10},
  {x:-60,y:10},{x:-20,y:10},
  {x:-60,y:30},{x:-40,y:10},{x:-20,y:30},

  // -
  {x:0,y:0},{x:10,y:0},

  // I
  {x:30,y:-30},{x:50,y:-30},{x:70,y:-30},
  {x:50,y:-10},{x:50,y:10},
  {x:30,y:30},{x:50,y:30},{x:70,y:30},

  // T
  {x:90,y:-30},{x:110,y:-30},{x:130,y:-30},
  {x:110,y:-10},{x:110,y:10},{x:110,y:30},

  // P
  {x:150,y:-30},{x:170,y:-30},
  {x:150,y:-10},{x:170,y:-10},
  {x:150,y:10},{x:170,y:10},
  {x:150,y:30},

  // -
  {x:-60,y:55},{x:-40,y:55},

  // L
  {x:-20,y:40},{x:-20,y:60},{x:-20,y:80},
  {x:0,y:80},{x:20,y:80},

  // O
  {x:40,y:40},{x:60,y:40},
  {x:30,y:60},{x:70,y:60},
  {x:40,y:80},{x:60,y:80},

  // W
  {x:90,y:40},{x:90,y:60},{x:100,y:80},
  {x:110,y:60},{x:120,y:80},
  {x:130,y:60},{x:130,y:40},

  // R
  {x:150,y:40},{x:170,y:40},
  {x:150,y:60},{x:170,y:60},
  {x:150,y:80},{x:170,y:80},

  // E
  {x:190,y:40},{x:210,y:40},
  {x:190,y:60},{x:200,y:60},
  {x:190,y:80},{x:210,y:80},

  // S
  {x:230,y:40},{x:250,y:40},
  {x:230,y:60},{x:240,y:60},
  {x:250,y:80},{x:230,y:80}
];





}

//stores the index of the pixel in the pixels array
let pixelNum;
let hands = [];
function draw() {

  hands = [];
  background(10, 0, 15, 255);


  translate(-dimension / 2, -7*dimension / 10);


  

  camera(0, 0, 750, 0, 0, 0);


  image(lowResLogo, -130,-70,400, 300);
  image(imaLogo, -50,-90,400, 300);
  let alpha = 150; 
  tint(255, 100, 240, alpha);
  image(qrCode, 840, 1230, 170, 170);
  image(info, 0, 1270);
  push();
  rotate(PI/2);
  alpha = 100; 
  tint(255, 200, 240, alpha);
  image(tischLogo, 40, -970,652*0.5,112*0.5);
  
  image(showTitle,330, -990 );
  pop();

  translate(0,0,20);

  //update the RGB value of each bead in the 2D array of beads according to the RGB value of the pixel that each bead is on
  video.loadPixels();
  for (let j = 1; j < beads.length; j += 1) {
    for (let i = 0; i < beads[0].length; i += 1) {
      pixelNum = calculatePixel(beads[i][j].x, beads[i][j].y, dimension);
      beads[i][j].updateColor([
        video.pixels[pixelNum],
        video.pixels[pixelNum + 1],
        video.pixels[pixelNum + 2],
      ]);
      if (segmentation) {
        let parts = bodySegmentation.getPartsId();
        beads[i][j].updatePosition(
          createVector(
            beads[i][j].x,
            beads[i][j].y,
            map(
              segmentation[
                calculateSegPixel(beads[i][j].x, beads[i][j].y, dimension)
              ],
              0,
              255,
              0,
              550
            )
          )
        );
        //draw all beads in the bead array
      if(segmentation[calculateSegPixel(beads[i][j].x, beads[i][j].y, dimension)] == parts.LEFT_HAND 
      || segmentation[calculateSegPixel(beads[i][j].x, beads[i][j].y, dimension)] == parts.RIGHT_HAND 
      ){
        beads[i][j].show();
        hands.push(beads[i][j]);
      }
      if(segmentation[calculateSegPixel(beads[i][j].x, beads[i][j].y, dimension)] == parts.LEFT_FACE
      || segmentation[calculateSegPixel(beads[i][j].x, beads[i][j].y, dimension)] == parts.RIGHT_FACE 
      ){
      beads[i][j].showFace();
      }
      
    }
  }
  for (let i = 0; i < 1; i++) {
    drawLine();
  }

  
}



function drawLine() {
  if(hands.length > 10){
  if (random() > map(hands.length, 20, 200, 0.99, 0.7)) {
  let randPix1 = random(hands);
  let randPix2 = random(textPoints);
  
    push();
    

stroke(200,0,100);

    strokeWeight(0.4);
    line(
      randPix1.x,
      randPix1.y,
      0,
    (randPix2.x+dimension/5),
    (randPix2.y+1.1*dimension+10),
      0
    );
    pop();
    rectMode(CENTER);
    push();
    fill(255, 100, 240);
    noStroke();
    rect(randPix2.x + dimension / 5 , randPix2.y + 1.1*dimension, 35, 3,20);
    pop();
  }
}
  else{
    let showText = random(textPoints2);
    
    push();
    rectMode(CENTER);
    fill(255, 0, 80);
    noStroke();
    rect(showText.x + dimension / 3 +40, showText.y + 1.1*dimension+10, 35, 3,20);
    pop();
  }
}
}