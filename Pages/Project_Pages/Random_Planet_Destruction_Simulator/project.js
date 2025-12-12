let img = [];
//where the base value of angle of rotation is stored for each planet
OrbitAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
SelfOrbitAngle = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let sunImg;
let moonImg;
let ringImg;
let particles = [];
let font;

function preload() {
  showMode = "key";
  displayBasicInformation();
  img[0] = loadImage("../Solar_System/Data/Mercury.png");
  //Source: https://sketchfab.com/3d-models/mercury-realistic-8k-215f364627054d25ae03bcd72afda714
  img[1] = loadImage("../Solar_System/Data/Venus.png");
  //Source: https://sketchfab.com/3d-models/venus-realistic-8k-2aa7e3beae7841299376808bcf3306b8
  img[2] = loadImage("../Solar_System/Data/Mars.jpg");
  //Source: https://sketchfab.com/3d-models/mars-realistic-12k-5ff4fbee7e20495190c3c538a1922bff
  img[3] = loadImage("../Solar_System/Data/Jupiter.jpeg");
  //Source: https://sketchfab.com/3d-models/realistic-jupiter-993ba62a539e4c308e9e3137df454ed6
  img[4] = loadImage("../Solar_System/Data/Saturn.jpg");
  //Source: https://sketchfab.com/3d-models/realistic-saturn-8k-e7a4eecf7c114d06828a044c1c4f15ae
  img[5] = loadImage("../Solar_System/Data/Uranus.jpg");
  //Source: https://sketchfab.com/3d-models/realistic-uranus-4k-8efca1ce8038429fa0fc0a94a7468eae
  img[6] = loadImage("../Solar_System/Data/Neptune.jpg");
  //Source: https://sketchfab.com/3d-models/neptune-8c6dc96f47ab4d798a1cb2d827da3fbe
  img[7] = loadImage("../Solar_System/Data/Earth.png");
  //Source: https://sketchfab.com/3d-models/realistic-earth-8k-899b7a8202ed48f0a0903c33cb5501b6
  img[8] = loadImage("../Solar_System/Data/Pluto.jpg");
  //Source: https://sketchfab.com/3d-models/pluto-a30ff3a5f4f3477d87fc534e0d1df7e2
  sunImg = loadImage("../Solar_System/Data/Sun.jpg");
  //Source: https://sketchfab.com/3d-models/ps1-style-low-poly-sun-9f2b6f87811242b8b6313b42667122cf
  img[9] = loadImage("../Solar_System/Data/Moon.jpg");
  //Source: https://sketchfab.com/3d-models/moon-26cc0b7878bb4d919b68e2be399db466
  ringImg = loadImage("../Solar_System/Data/Saturn.jpg");
  //Source: https://www.tylermw.com/posts/data_visualization/tutorial-visualizing-saturns-appearance-from-earth-in-r.html
  font = loadFont("Neon AI.otf");
}

//I took the code for the particle class from https://editor.p5js.org/Bacarri_WB/sketches/oL3nA9JYd to create an explosion effect. I changed some of the code to accomadate to my project

class Particle {
  //c = color
  constructor(c) {
    //creates particles in the center of the canvas
    this.pos = createVector(0, 0, 0);
    //velocity controls how fast the particles move away from its starting position. I decided to change it to 7-8 to make it move faster
    this.vel = p5.Vector.random3D().normalize().mult(random(7, 8));
    //w controls the size of the particles. I decided to make the particles by changing w to 0-1
    this.w = random(0, 1);
    //c is the color
    this.c = c;
  }
  //Adds velocity to position to change its position
  update() {
    this.pos.add(this.vel);
  }
  //Draw the particles
  show() {
    push();
    noStroke();
    fill(this.c);
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(this.w);
    pop();
  }
}
//When the space key is pressed the program toggles between pause and continue
let pause = false;
let explo = false;

//moonI updates the index of the moon in the array
let moonI;
//c stores the randomly selected planet to remove
let c;
function keyPressed() {
  keyPressedShow();
  
  //if D is pressed, create the explosion effect and remove the randomly selected planet from the array
  if (key == "D" || key == "d") {
    explo = true;
    c = random(planets);
    img.splice(planets.indexOf(c), 1);
    OrbitAngle.splice(planets.indexOf(c), 1);
    SelfOrbitAngle.splice(planets.indexOf(c), 1);
    planets.splice(planets.indexOf(c), 1);

    //updates the index of moon
    for (let i = 0; i < planets.length; i++) {
      if (planets[i].moon) {
        moonI = i;
      }
    }
    //if the removed planet is earth, also remove moon
    if (c.hasMoon) {
      planets.splice(moonI, 1);
      img.splice(moonI, 1);
      OrbitAngle.splice(moonI, 1);
      SelfOrbitAngle.splice(moonI, 1);
    }
  }
  return false;
}
//I took the code for explosion function from https://editor.p5js.org/Bacarri_WB/sketches/oL3nA9

function explosion() {
  if (random(1) > 0.97) {
    //controls how how many particles are drawn
    for (let i = 0; i < 1000; i++) {
      //draw the particles and add them to the array
      co = color(255, 255, 255);
      p = new Particle(co);
      particles.push(p);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    //gets rid of the particles that exceed a certain boundary, which I set to 100000
    if (
      dist(
        particles[i].pos.x,
        particles[i].pos.y,
        particles[i].pos.z,
        0,
        0,
        0
      ) < 100000
    ) {
      particles[i].update();
      particles[i].show();
    } else {
      particles.splice(i, 1);
    }
  }
}

//d - distance from the point they orbit around
//r - radius
//o - orbiting speed
//so - rotational speed
//[a1,a2,a3] - axis of rotation
//ring - if it has a ring
//moon - if it is a moon
//hasMoon - if it has a moon
//name - the name of the planet
class planet {
  constructor(d, r, o, so, [a1, a2, a3], ring, moon, hasMoon, name) {
    this.d = d;
    this.r = r;
    this.o = o;
    this.so = so;
    this.a1 = a1;
    this.a2 = a2;
    this.a3 = a3;
    this.ring = ring;
    this.moon = moon;
    this.hasMoon = hasMoon;
    this.name = name;
  }
}

//r - radius
class star {
  constructor(r) {
    this.r = r;
  }
}

Sun = new star(70);
let planets = [];
//Mercury
planets[0] = new planet(
  387 / 6,
  3.83,
  1 / 0.241,
  1759,
  [12, 64, 123],
  false,
  false,
  false,
  "Mercury"
);
//Venus
planets[1] = new planet(
  723 / 6,
  9.49,
  1 / 0.615,
  1168,
  [34, 82, 57],
  false,
  false,
  false,
  "Venus"
);
//Mars
planets[2] = new planet(
  1520 / 6,
  5.32,
  1 / 1.88,
  1030,
  [72, 60, 2],
  false,
  false,
  false,
  "Mars"
);
//Jupiter
planets[3] = new planet(
  5200 / 10,
  112.1 * 0.25,
  1 / 11.9,
  100,
  [0, 1, 1],
  false,
  false,
  false,
  "Jupiter"
);
//Saturn
planets[4] = new planet(
  9570 / 10,
  94.5 * 0.25,
  1 / 29.4,
  100,
  [0, 1, 1],
  true,
  false,
  false,
  "Saturn"
);
//Uranus
planets[5] = new planet(
  19100 / 15,
  40.01 * 0.25,
  1 / 83.7,
  100,
  [0, 1, 1],
  false,
  false,
  false,
  "Uranus"
);
//Neptune
planets[6] = new planet(
  30100 / 20,
  38.8 * 0.25,
  1 / 163.7,
  100,
  [0, 1, 1],
  false,
  false,
  false,
  "Neptune"
);
//Earth
planets[7] = new planet(
  1000 / 6,
  10.0,
  1,
  100,
  [39, 12, 3],
  false,
  false,
  true,
  "Earth"
);
//Pluto
planets[8] = new planet(
  39480 / 20,
  1.87,
  1 / 247.9,
  63.9,
  [48, 23, 2],
  false,
  false,
  false,
  "Pluto"
);
//Moon
planets[9] = new planet(
  12,
  2.72,
  1 / 0.05748,
  63.9,
  [48, 23, 2],
  false,
  true,
  false,
  "Moon"
);
//time controls how long the explosion effect lasts
let time = 0;
let canvas;
function setup() {

  canvas = createCanvas(2000, 1400, WEBGL);
  
  
  canvas.parent(document.getElementById("projectContainer"));
  angleMode(DEGREES);
  noLoop();

}

function draw() {
  //the program ends if time is set below 0
  if (time < 0) {
    background(0);
    fill("white");
    textSize(40);
    text("Solar System", 0, -60);

    textSize(30);
    text("Has Been Destroyed", 0, 50);
  } else {
    background(0);

    //allows camera to focus on the center
    orbitControl();

    time++;
    //drawing the sun in the center
    push();
    noStroke();
    fill(255, 255, 255);
    texture(sunImg);
    sphere(Sun.r, 20000);
    pop();

    let earthI = 7;
    //making the sun in the center a source of light
    pointLight(255, 255, 255, 0, 0, 0);
    //updates the index of the Earth
    for (let i = 0; i < planets.length; i++) {
      push();
      if (planets[i].hasMoon) {
        earthI = i;
      }
      //for all the planets excluding moon, draw a circle representing the path of their orbit paths
      if (!planets[i].moon) {
        stroke(255, 255, 255, 100);
        strokeWeight(0.5);
        noFill();
        ellipse(0, 0, planets[i].d * 2.8, planets[i].d * 2.8, 50);
      }
      //store the current value of the angle of orbit, the angle of self orbit, and the axis of rotation
      co = OrbitAngle[i];
      cso = SelfOrbitAngle[i];
      a = [planets[i].a1, planets[i].a2, planets[i].a1];

      //if the user wants to pause the animation, for all the planets exluding moon, keep the current position and angle of the planets unchanged
      if (!planets[i].moon && pause) {
        rotate(co);
        translate(planets[i].d, planets[i].d);
        rotate(cso, a);
        //if the user wants to pause the animation, for moon, keep the current position and angle relative to the position of the Earth unchanged
      } else if (planets[i].moon && pause) {
        rotate(OrbitAngle[earthI]);
        translate(planets[earthI].d, planets[earthI].d);
        rotate(co);
        translate(planets[i].d, planets[i].d);
        rotate(cso, a);
        //if the animation is not paused, for moon, rotate it about the Earth relative to its orbit velocity and about itself relative to its rotational velocity
      } else if (planets[i].moon) {
        rotate(OrbitAngle[earthI]);
        translate(planets[earthI].d, planets[earthI].d);
        rotate(OrbitAngle[i]);
        translate(planets[i].d, planets[i].d);
        rotate(SelfOrbitAngle[i], [
          planets[i].a1,
          planets[i].a2,
          planets[i].a1,
        ]);
        OrbitAngle[i] += planets[i].o;
        SelfOrbitAngle[i] += planets[i].so;
        //if the animation is not paused, for all the other planets excluding moon, rotate them about the sun relative to their orbit velocity and about themselves relative to their rotational velocity
      } else {
        rotate(OrbitAngle[i]);
        translate(planets[i].d, planets[i].d);
        rotate(SelfOrbitAngle[i], [
          planets[i].a1,
          planets[i].a2,
          planets[i].a1,
        ]);
        OrbitAngle[i] += planets[i].o;
        SelfOrbitAngle[i] += planets[i].so;
      }
      //draw each planet and apply texture to each of them
      noStroke();

      texture(img[i]);

      sphere(planets[i].r);

      //if the planet is saturn, add a flat cylinder around it to represent its ring
      if (planets[i].ring) {
        texture(ringImg);
        noStroke();
        rotate(1, [1, 0, 0]);
        cylinder(34, 1, 24, 1, true, true);
      }

      pop();
    }

    //draw the explosion effect if D is clicked, for a duration of 175
    if (explo && time < 175) {
      noLights();
      explosion();
      //after a duration of 125, displaying a text that indicates which planet has been removed
      if (time > 125) {
        let cam = createCamera();
        background(255);
        textAlign(CENTER);
        textFont(font);
        //if all the planets are removed, end the program
        if (planets.length == 0) {
          time = -1;
        } else {
          fill("red");
          textSize(100);
          text(c.name, 0, -60);

          textSize(30);
          text("Has Been Destroyed", 0, 50);
        }
      }

      //else, reset everything
    } else {
      time = 0;
      explo = false;
      particles = [];
    }
  }
  showHint();
}
