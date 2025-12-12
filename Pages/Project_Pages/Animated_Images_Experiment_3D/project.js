let img2;
let pic2;

//determines the current effect applied
let mode;
let modeShape = "sphere";

let buttons = [
  { name: "neutral", c: "white" },
  { name: "emphasize", c: "white" },
  { name: "wave", c: "white" },
  { name: "random", c: "white" },
  { name: "2Dspread", c: "white" },
  { name: "3Dspread", c: "white" },
  { name: "2Dshrink", c: "white" },
  { name: "3Dshrink", c: "white" },
  { name: "take pic", c: "red" },
];

function buttonPressed() {
  mode = this.value();
}
function preload() {
  showMode = "key";
  displayBasicInformation();
  img2 = loadImage("Assets/img4.png");
}
//returns index of pixel for a given x,y and width of the image
function calculatePixel(x, y, w) {
  return (y - 1) * w * 4 + x * 4 - 4;
}
let canvas;
function setup() {
  img2.pixelDensity(1);
  img2.resize(300, 300);
  canvas = createCanvas(2000, 1200, WEBGL);
  canvas.parent(document.getElementById("projectContainer"));
  pic2 = new Pic({ img: img2 });
  pic2.setPic();
  for (let i = 0; i < buttons.length; i++) {
    let c = buttons[i].c;
    let name = buttons[i].name;
    buttons[i] = createButton(name, name);
    buttons[i].parent(document.getElementById("controls"));
    buttons[i].mousePressed(buttonPressed);
    
    if(c == "red"){
        buttons[i].style("color", "red");
        buttons[i].style("border","0.3rem solid red");
        buttons[i].style("background-color", "white");
    }else{
        buttons[i].style("color", "black");
        buttons[i].style("border","0.rem solid black");
        buttons[i].style("background-color", c);
    }
    
    buttons[i].style("font-size", "2em");
    
    buttons[i].style("width", "7em");
    buttons[i].style("height", "2.5em");
    buttons[i].style("margin", "0.5em");
  }
  noLoop();
}
let freeze = false;
function keyPressed() {
  keyPressedShow();

}
function draw() {
  background(0);
  orbitControl();

  pointLight(255, 255, 255, 0, 0, 500);
  ambientLight(200);
  translate(-150, -150);

  pic2.showPic();
  pic2.updatePic();

  if (mode == "take pic") {
    saveCanvas();
    mode = undefined;
  }
  showHint();
}
