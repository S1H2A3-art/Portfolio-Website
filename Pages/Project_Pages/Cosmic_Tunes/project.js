let notes = ["G5", "F4", "C4", "A4", "G3", "C3", "A2", "G1"];
let buttons = [];
let monitorSketch;

//buttons stores the selected celestial body to follow in cb
let cb = celestialBodies[0];
function buttonPressed() {
  cb = celestialBodies[this.value()];
}

function keyPressed(){
    keyPressedShow();
}

function initMonitorSketch() {
  const monitorContainer = document.getElementById("monitor");
  if (!monitorContainer) {
    requestAnimationFrame(initMonitorSketch);
    return;
  }
  if (monitorSketch) {
    monitorSketch.remove();
  }
  monitorSketch = new p5(s);
}

function preload() {
    showMode = "key";
    displayBasicInformation();
    
  for (let CelestialBody of celestialBodies) {
    CelestialBody.img = loadImage(CelestialBody.img);
  }
}
let canvas2;
let canvasInitialized = false;

function setupButtons(parentEl) {
  for (let i = 0; i < celestialBodies.length; i++) {
    const label = celestialBodies[i].name !== "sun" ? celestialBodies[i].name : "solar system";
    buttons[i] = createButton(label, str(i));
    buttons[i].parent(parentEl);
    buttons[i].mousePressed(buttonPressed);
    buttons[i].style("color", "steelblue");
    buttons[i].style("border", "0.1rem solid steelblue");
    buttons[i].style("background-color", "white");
    buttons[i].style("padding", "0.3em");
    buttons[i].style("font-size", "2rem");
    buttons[i].style("margin", "0.5em");
    buttons[i].style("width", "12rem");
  }
}

function waitForProjectLayout() {
  if (canvasInitialized) {
    return;
  }
  const container = document.getElementById("projectContainer");
  const controls = document.getElementById("controls");
  if (!container || !controls) {
    requestAnimationFrame(waitForProjectLayout);
    return;
  }

  canvas2 = createCanvas(2000, 1000, WEBGL);
  canvas2.parent(container);
  setupButtons(controls);
  noLoop();
  canvasInitialized = true;
}

function setup() {
  waitForProjectLayout();
  initMonitorSketch();
}

let cameraAngle = 0;
let cameraPosition;
function changeCamera() {
  //top view of the entire solar system if the camera follows the sun
  if (cb.name == "sun") {
    camera(0, 8000, 0.1, cb.position.x, 0, cb.position.y);
  } else {
    cameraPosition = createVector(
      cb.position.x + cb.cameraDistance * cos(cameraAngle),
      cb.position.y + cb.cameraDistance * sin(cameraAngle)
    );
    //set the camera to orbit around the selected celestial body to follow
    camera(
      cameraPosition.x,
      cb.cameraPerspective,
      cameraPosition.y,
      cb.position.x,
      0,
      cb.position.y
    );
    cameraAngle += cb.cameraSpeed;
  }
}

//stores the last planet that has made a sound
let cb2;
function draw() {
  background(0);

  //draw the sun first so lighting doesn't affect it
  celestialBodies[0].show();

  changeCamera();

  //lighting from the position of the sun and some ambient light
  pointLight(
    255,
    255,
    255,
    celestialBodies[0].position.x,
    0,
    celestialBodies[0].position.y
  );
  ambientLight(20);

  for (let CelestialBody of celestialBodies) {
    if (CelestialBody.name != "sun") {
      CelestialBody.orbit();
      CelestialBody.show();

      push();
      stroke(255, 255, 255, 70);
      strokeWeight(10);
      noFill();
      if (cb == celestialBodies[0]) {
        push();
        //highlight the orbit of the last planet that has made a sound
        if (cb2 == CelestialBody) {
          stroke("yellow");
        }
        //draw the orbits
        cylinder(CelestialBody.distance, -5, 24, 0, false, false);
        pop();
        line(
          2 * celestialBodies[8].distance,
          0,
          -2 * celestialBodies[8].distance,
          0
        );
      }

      pop();
    }
  }
  showHint();
}

//what is displayed on the orbit frequency monitor
s = function (p) {

  p.setup = function () {
    // create the canvas and store the reference
    let canvas = p.createCanvas(2000, 200);
canvas.parent(document.getElementById("monitor"));
    
   
    monoSynth = new p5.MonoSynth();
    monoSynth1 = new p5.MonoSynth();
    
  };

  p.draw = function () {
    p.background(0);
    //console.log("hi");
    //draw grids
    for (let i = 0; i < p.width; i += 20) {
      for (let j = 0; j < p.width; j += 20) {
        p.noFill();
        p.stroke(255, 255, 255, 10);
        p.rect(i, j, 20);
      }
    }
    p.stroke(255, 255, 255);
    p.strokeWeight(1.2);
    p.fill(0, 0, 255, 20);
    p.line(0, 100, p.width, 100);
    p.strokeWeight(1.5);
    p.stroke(255, 255, 255, 60);
    p.rect(0, 0, p.width, 200);
    p.fill("white");
    p.text("Orbit Frequency Monitor", 10, 15);
    
    //draw the sine wave for the angle of the selected planet
    if (cb.name != "sun") {
      for (let i = p.width; i > 0; i -= 1) {
        
        //amplitude is determined by its distance to the sun
        p.point(
          i,
          map(cb.distance / 500, 0, 30, 10, 80) * sin(cb.angle - i * 0.01) + 100
        );
      }
      if (abs(sin(cb.angle)) < 0.1) {
        monoSynth.play(notes[cb.index - 1], 0, 0, cb.distance / 500);
      }
      //draw the sine wave for the angle of all planets if the selected celestial body is the sun
    } else {
      for (let CelestialBody of celestialBodies) {
        if (
          abs(sin(CelestialBody.angle)) < 0.01 &&
          CelestialBody.name != "sun"
        ) {
          monoSynth1.play(
            notes[CelestialBody.index - 1],
            0,
            0,
            CelestialBody.distance / 5000
          );
          cb2 = CelestialBody;
          p.background(255, 255, 0, 50);
        }
        for (let i = p.width; i > 0; i -= 1) {
          if (CelestialBody.angle > 101) {
            p.point(
              i,
              map(CelestialBody.distance / 500, 0, 30, 10, 350) *
                sin(CelestialBody.angle - i * 0.01) +
                100
            );
          }
        }
      }
    }
    
  };
};
