let img = [];
//where the base value of angle of rotation is stored for each planet
OrbitAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
SelfOrbitAngle = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let sunImg;
let moonImg;
let ringImg;

function preload() {
  showMode = "key";
  displayBasicInformation();
  img[0] = loadImage("Data/Mercury.png");
  //Source: https://sketchfab.com/3d-models/mercury-realistic-8k-215f364627054d25ae03bcd72afda714
  img[1] = loadImage("Data/Venus.png");
  //Source: https://sketchfab.com/3d-models/venus-realistic-8k-2aa7e3beae7841299376808bcf3306b8
  img[2] = loadImage("Data/Mars.jpg");
  //Source: https://sketchfab.com/3d-models/mars-realistic-12k-5ff4fbee7e20495190c3c538a1922bff
  img[3] = loadImage("Data/Jupiter.jpeg");
  //Source: https://sketchfab.com/3d-models/realistic-jupiter-993ba62a539e4c308e9e3137df454ed6
  img[4] = loadImage("Data/Saturn.jpg");
  //Source: https://sketchfab.com/3d-models/realistic-saturn-8k-e7a4eecf7c114d06828a044c1c4f15ae
  img[5] = loadImage("Data/Uranus.jpg");
  //Source: https://sketchfab.com/3d-models/realistic-uranus-4k-8efca1ce8038429fa0fc0a94a7468eae
  img[6] = loadImage("Data/Neptune.jpg");
  //Source: https://sketchfab.com/3d-models/neptune-8c6dc96f47ab4d798a1cb2d827da3fbe
  img[7] = loadImage("Data/Earth.png");
  //Source: https://sketchfab.com/3d-models/realistic-earth-8k-899b7a8202ed48f0a0903c33cb5501b6
  img[8] = loadImage("Data/Pluto.jpg");
  //Source: https://sketchfab.com/3d-models/pluto-a30ff3a5f4f3477d87fc534e0d1df7e2

  sunImg = loadImage("Data/Sun.jpg");
  //Source: https://sketchfab.com/3d-models/ps1-style-low-poly-sun-9f2b6f87811242b8b6313b42667122cf
  img[9] = loadImage("Data/Moon.jpg");
  //Source: https://sketchfab.com/3d-models/moon-26cc0b7878bb4d919b68e2be399db466
  ringImg = loadImage("Data/Saturn.jpg");
  //Source: https://www.tylermw.com/posts/data_visualization/tutorial-visualizing-saturns-appearance-from-earth-in-r.html
}


//When the space key is pressed the program toggles between pause and continue
let pause = false;
let moonI;
let planI;
let c;
function keyPressed() {
  keyPressedShow();

}

//d - distance from the point they orbit around
//r - radius
//o - orbiting speed
//so - rotational speed
//[a1,a2,a3] - axis of rotation
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
    if(showHint){
      orbitControl();
    }

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
        if (!pause) {
    OrbitAngle[i] += planets[i].o;
    SelfOrbitAngle[i] += planets[i].so;
  }
        //if the animation is not paused, for all the other planets excluding moon, rotate them about the sun relative to their orbit velocity and about themselves relative to their rotational velocity
      } else {
        rotate(OrbitAngle[i]);
        translate(planets[i].d, planets[i].d);
        rotate(SelfOrbitAngle[i], [
          planets[i].a1,
          planets[i].a2,
          planets[i].a1,
        ]);
        if (!pause) {
    OrbitAngle[i] += planets[i].o;
    SelfOrbitAngle[i] += planets[i].so;
  }
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

  }
  showHint();

}
