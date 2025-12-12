class CelestialBody {
  constructor({
    name,
    img,
    distance,
    radius,
    orbitingV,
    rotationV,
    index,
    cameraDistance,
    cameraSpeed,
    cameraPerspective,
  } = {}) {
    this.name = name;
    this.img = img;
    this.distance = distance * 400;
    this.radius = radius / 7000;
    this.orbitingV = orbitingV * 4;
    this.rotationV = rotationV;
    this.angle = 100;
    this.rotationAngle = 0;
    this.index = index;
    this.cameraDistance = cameraDistance;
    this.cameraSpeed = cameraSpeed;
    this.cameraPerspective = cameraPerspective;
  }

  //calculate position based on angle and distance from the sun
  get position() {
    return createVector(
      this.distance * cos(this.angle),
      this.distance * sin(this.angle)
    );
  }

  orbit() {
    this.angle += this.orbitingV;
  }
  show() {
    push();
    translate(this.position.x, 0, this.position.y);
    rotate(this.rotationAngle, [0, 1, 0]);
    this.rotationAngle += this.rotationV;

    //draw the saturn ring
    if (this.name == "saturn") {
      push();
      translate(0, 0, 0);
      noStroke();
      texture(this.img);
      rotate(0.5, [0, 1, 0]);
      cylinder(this.radius + 5, 0.01, 24, 1, true, true);
      pop();
    }
    if(this.radius){
    noStroke();
    texture(this.img);
    sphere(this.radius,500,500);
    pop();
    }
  }
}

//all stats are based on real data. radius is in km, distance in au, orbiting velocity in 1/days in an orbit period, rotational velocity in 1/days in a rotation period
let celestialBodies = [
  new CelestialBody({
    name: "sun",
    img: "../Solar_System/Data/Sun.jpg",
    radius: 700000,
    distance: 0,
    orbitingV: 0,
    rotationV: 1 / 27,
    index: 0,
  }),
  new CelestialBody({
    name: "mercury",
    img: "../Solar_System/Data/Mercury.png",
    radius: 2440,
    distance: 0.4,
    orbitingV: 1 / 88,
    rotationV: 1 / 59,
    index: 1,
    cameraDistance: 90,
    cameraSpeed: 0.01,
    cameraPerspective: -30,
  }),
  new CelestialBody({
    name: "venus",
    img: "../Solar_System/Data/Venus.png",
    radius: 6052,
    distance: 0.72,
    orbitingV: 1 / 224.7,
    rotationV: 1 / 243,
    index: 2,
    cameraDistance: 90,
    cameraSpeed: 0.01,
    cameraPerspective: -30,
  }),
  new CelestialBody({
    name: "earth",
    img: "../Solar_System/Data/Earth.png",
    radius: 6371,
    distance: 1,
    orbitingV: 1 / 365,
    rotationV: 1 / 1,
    index: 3,
    cameraDistance: 90,
    cameraSpeed: 0.015,
    cameraPerspective: -10,
  }),
  new CelestialBody({
    name: "mars",
    img: "../Solar_System/Data/Mars.jpg",
    radius: 3390,
    distance: 1.5,
    orbitingV: 1 / 687,
    rotationV: 1 / 1,
    index: 4,
    cameraDistance: 90,
    cameraSpeed: 0.01,
    cameraPerspective: -10,
  }),
  new CelestialBody({
    name: "jupiter",
    img: "../Solar_System/Data/Jupiter.jpeg",
    radius: 71492,
    distance: 5.2,
    orbitingV: 1 / 4331,
    rotationV: 1 / 0.4125,
    index: 5,
    cameraDistance: 100,
    cameraSpeed: 0.01,
    cameraPerspective: -30,
  }),
  new CelestialBody({
    name: "saturn",
    img: "../Solar_System/Data/Saturn.jpg",
    radius: 58232,
    distance: 9.5,
    orbitingV: 1 / 10756,
    rotationV: 1 / 0.4375,
    index: 6,
    cameraDistance: 100,
    cameraSpeed: 0.01,
    cameraPerspective: -20,
  }),
  new CelestialBody({
    name: "uranus",
    img: "../Solar_System/Data/Uranus.jpg",
    radius: 25559,
    distance: 19,
    orbitingV: 1 / 30687,
    rotationV: 1 / 0.4375,
    index: 7,
    cameraDistance: 90,
    cameraSpeed: 0.01,
    cameraPerspective: -20,
  }),
  new CelestialBody({
    name: "neptune",
    img: "../Solar_System/Data/Neptune.jpg",
    radius: 24622,
    distance: 30,
    orbitingV: 1 / 60190,
    rotationV: 1 / 0.67,
    index: 8,
    cameraDistance: 90,
    cameraSpeed: 0.01,
    cameraPerspective: -20,
  }),
];
