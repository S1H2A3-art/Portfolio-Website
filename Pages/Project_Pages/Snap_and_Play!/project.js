let webcams = [];
let activeCam;
const PICWIDTH = 720*2 / 3;
const PICHEIGHT = 720*2 / 3;

const HORIZONTAL_PICTURES = 3;
const VERTICLE_PICTURES = 3;


let mode;
let modeColor = "red";
let picMedian; 
let picSorted;

let pics = new Array(HORIZONTAL_PICTURES);
for (let i = 0; i < pics.length; i++) {
  pics[i] = new Array(VERTICLE_PICTURES);
  for (let j = 0; j < pics[i].length; j++) {
    pics[i][j] = new Pic({ i: i, j: j });
  }
}

function calculatePixel(x, y) {
  return (y - 1) * width * 4 + x * 4 - 4;
}
function calculatePic(x, y) {
  return { x: floor(x / PICWIDTH), y: floor(y / PICHEIGHT) };
}

function refreshFrame() {
  push();
  strokeWeight(30 / 2);
  stroke("white");
  noFill();
  for (let x = 0; x < pics[0].length; x++) {
    for (let y = 0; y < pics.length; y++) {
      rect(pics[x][y].position.x1, pics[x][y].position.y1, PICWIDTH, PICHEIGHT);
    }
  }

  pop();
}
function drawFrame() {
  let hover = {x:selected.x, y:selected.y};
  push();
  strokeWeight(18 / 2);
  stroke(modeColor);
  noFill();
  rect(
    pics[hover.x][hover.y].position.x1,
    pics[hover.x][hover.y].position.y1,
    PICWIDTH,
    PICHEIGHT
  );
  pop();
}


let selected = {x:0,y:0};
function keyPressed() {
  keyPressedShow()
  if(keyCode == LEFT_ARROW){
    if(selected.x != 0){
      selected.x -= 1;
    }  
  }
  else if(keyCode == RIGHT_ARROW){
    if(selected.x != 2){
      selected.x += 1;
    }  
  }
  if(keyCode == UP_ARROW){
    if(selected.y != 0){
      selected.y -= 1;
    }  
  }
  else if(keyCode == DOWN_ARROW){
    if(selected.y != 2){
      selected.y += 1;
    }  
  }
  else if(key == "t"){
    mode = "colorize";
  }
  else if(key == "q"){
    mode = "inverse";
  }
  else if(key == "w"){
    mode = "posterize";
  }
  else if(key == "e"){
    mode = "grain";
  }
  else if(key == "r"){
    mode = "duotone";
  }
  else if(key == " "){
    mode = "take pic";
  }
  else if(keyCode == ENTER){
    mode = "capture";
  }
  else if(keyCode == SHIFT){
    mode = "reset";
  }
    if (mode == "take pic") {
      sp = true;
      mode = "capture";
    }
   else {
    
    if (mode == "reset") {
      pics[selected.x][selected.y] = new Pic({ i: selected.x, j: selected.y });
      mode = undefined;
    } else if(mode != undefined){
      
      pics[selected.x][selected.y].setPic();
      
      
    }
  }
}
async function preload1(){
    await displayBasicInformation();
}
let canvas1;
async function setup() { 
    await preload1();
  canvas1 = createCanvas(HORIZONTAL_PICTURES * PICWIDTH, VERTICLE_PICTURES * PICHEIGHT);
  canvas1.parent(document.getElementById("projectContainer"));
  pixelDensity(1);
  noLoop();
 getVideoDevices();
}

let sp;
function draw() {
     window.addEventListener("keydown", function(e) {
  // Check if the pressed key is an arrow key or the spacebar
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault(); // Prevent the default scrolling behavior
  }
}, false);
 
  if (webcams.length) {
    
    activeCam = webcams[0];
    for (let i = 0; i < pics.length; i++) {
      for (let j = 0; j < pics[i].length; j++) {
        if (pics[i][j].beads[0] == undefined) {
          image(activeCam, i * PICWIDTH, j * PICHEIGHT, PICWIDTH, PICHEIGHT);
        } else {
          if (pics[i][j].freeze == false) {
            print(picMedian);
            pics[i][j].picShow();
            pics[i][j].freeze = true;
            mode = undefined;
          }
        }
      }
    }
  }
  refreshFrame();
  if(sp != true){
    drawFrame();
  }
  else{
    saveCanvas();
    sp = false;
  }
  showHint(40);
}

