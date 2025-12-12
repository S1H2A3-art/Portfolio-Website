//class of 3D particles that constitutes an image
class Bead {
  constructor({ x, y, z, rgb } = {}) {
    this.rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
    this.originalX = x;
    this.originalY = y;
    this.position = createVector(x, y, z);
    this.diameter = 13;
    this.angle = 0;
  }
  //return center position of the image
  get center() {
    return createVector((299 - 3) / 2, (299 - 3) / 2, 0);
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get z() {
    return this.position.z;
  }
  get radius() {
    return this.diameter / 2;
  }
  update() {
    let velocity;

    if (mode == "neutral") {
      //creates vector towards its original position
      velocity = createVector(
        (this.originalX - this.position.x) / 20,
        (this.originalY - this.position.y) / 20,
        -this.position.z / 20
      );
      } else if (mode == "emphasize") {
      //emphasize orders the beads from the brightest to the darkest in the z-axis
      let targetZ = 0;
      if (this.rgb.r != undefined) {
        targetZ = map(this.rgb.r + this.rgb.g + this.rgb.b, 0, 3 * 255, 0, 200);
      }
      velocity = createVector(0, 0, (targetZ - this.position.z) / 20);
    } else if (mode == "wave") {
      this.angle += 10;
      velocity = createVector(0, 0, 5 * sin((this.x + this.angle) / 100));
    } else if (mode == "random") {
      velocity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    } else if (mode == "2Dspread") {
      //creates 2D vector that points away from the center of the image
      velocity = createVector(this.originalX, this.originalY).sub(this.center);
      velocity.limit(5);
    } else if (mode == "3Dspread") {
      //creates 3D vector that points away from the center of the image
      velocity = createVector(this.originalX, this.originalY, this.z).sub(
        this.center
      );
      velocity.limit(5);
    } else if (mode == "2Dshrink") {
      //creates 2D vector that points to center of the image relative to their original position
      velocity = this.center.sub(createVector(this.originalX, this.originalY));
      velocity.limit(5);
    } else if (mode == "3Dshrink") {
      //creates 3D vector that points to center of the image relative to their original position
      velocity = this.center.sub(
        createVector(this.originalX, this.originalY, this.z)
      );
      velocity.limit(5);
    }

    this.position.add(velocity);
  }
  show() {
    push();
    if (modeShape == "sphere") {
      translate(this.x, this.y, this.z);
      if (this.rgb.r != undefined) {
        fill(this.rgb.r, this.rgb.g, this.rgb.b);
      }
      noStroke();
      sphere(this.diameter / 5);
    } 
    pop();
  }
}