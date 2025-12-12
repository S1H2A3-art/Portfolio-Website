let THINKER_IDENTITY;

function preload() {
  THINKER_IDENTITY = loadJSON('The Thinker/Thinker Identity.json');
}

// DOM elements for interactivity
let input;
let submitButton;
let inputContainer;
let thinkerMessageContainer;

// properties of grid object
let grid;
let gridRows = 120;
let gridCols = 120;

function setup() {

  // initializes DOM
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("thinkerCanvas");
  canvas.position(0, 0);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("width", "100vw");
  canvas.style("height", "100vh");
  
  input = createInput("Try communicating with this unknown figure...");

  submitButton = createButton("Speak");
  submitButton.mousePressed(userInput);

  input.style("font-size","3rem");
  input.style("padding","0.75rem 1rem");
  input.style("min-width","70rem");
  submitButton.style("font-size","3rem");
  submitButton.style("padding","0.75rem 1.2rem");

  inputContainer = createDiv();
  inputContainer.id("inputContainer");

  inputContainer.style("position", "fixed");
  inputContainer.style("bottom", "10%");
  inputContainer.style("left", "50%");
  inputContainer.style("transform", "translate(-50%, -50%)");
  inputContainer.style("gap","0.75rem");
  inputContainer.style("align-items","center");
  inputContainer.style("justify-content","center");
  inputContainer.style("opacity","0");
  inputContainer.style("display","none");
  inputContainer.style("z-index","1");
  
  input.parent(inputContainer);
  submitButton.parent(inputContainer); 
  
  canvas.parent(document.getElementsByTagName("body")[0]);
  inputContainer.parent(document.getElementsByTagName("body")[0]);

  thinkerMessageContainer = createDiv();
  thinkerMessageContainer.id("thinkerMessageContainer");
  thinkerMessageContainer.style("position", "fixed");
  thinkerMessageContainer.style("top", "20%");
  thinkerMessageContainer.style("left", "50%");
  thinkerMessageContainer.style("transform", "translate(-50%, -50%)");
  thinkerMessageContainer.style("display","flex");
  thinkerMessageContainer.style("gap","0.75rem");
  thinkerMessageContainer.style("align-items","center");
  thinkerMessageContainer.style("justify-content","center");
  thinkerMessageContainer.style("opacity","0");
  thinkerMessageContainer.style("display","none");
  thinkerMessageContainer.style("z-index","1");
  thinkerMessageContainer.style("color","white");
  thinkerMessageContainer.style("text-align","center");
  thinkerMessageContainer.style("font-size","2rem");
  thinkerMessageContainer.style("padding","0.75rem 1rem");

  thinkerMessageContainer.html("...");
  thinkerMessageContainer.parent(document.getElementsByTagName("body")[0]);

  // Link JSON identity to Thinker engine
  Thinker.THINKER_IDENTITY = THINKER_IDENTITY;

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CENTER);

  // Initialize pixel grid
  grid = new Grid(gridRows, gridCols);

  // Initializes Thinker
  userInput("introduce yourself");
}

//constrols user input messages
function userInput(){
  const message = input.value();
  input.value('Try communicating with this unknwon figure'); // clear only when user typed it
  Thinker.think(message);
}

// displays pressure level 
function drawStats(){
    push();
    stroke("white");
    noFill();
    rect(250,250,50,350);
    pop();
    push();
    fill("red");
    noStroke();
    rect(250,250,50,map(Thinker.pressureLevel,0,1,0,-350));
    pop();
}

// determines when a new image is displayed
let newImage = true;
let count = 0;

function draw() {
   
  background(0);

  // If Thinker is activated and has images, animate them
  if (Thinker.images[0] && thinkerActive) {
  
    // 
    if(newImage){  
      // alternate between images to show
      let imageShowing = Thinker.images[count % Thinker.images.length];
      // sets pixels of grid based on image to display
      grid.setPic(imageShowing);
      newImage = false;
    }else{
      // alternate image every 3 frames
      if (frameCount % 3 == 0){
        count++;
        newImage = true;
      }
    }

    // draws grid
    push();
    translate(width/2, height/2);
    grid.forEach((i, j) => {
        if (grid.grids[i][j].rgb.x != 0) grid.grids[i][j].show();
    });
    pop();
    

 
  }

  drawStats();
}
