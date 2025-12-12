class Bead {
  constructor({ x, y, z, rgb, opacity } = {}) {
    this.position = createVector(x, y, z);
    this.rgb = rgb;
    this.diameter = 4;
    this.opacity = opacity;
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

  updateColor(newRGB) {
    this.rgb = newRGB;
  }
  updatePosition(newPosition) {
    this.position = newPosition;
  }

  show() {
    push();

    translate(
      this.position.x,
      this.position.y,
      -this.position.z + random(-5, 5)
    );
    if (
      random(1) > inverse &&
      this.rgb[0] + this.rgb[1] + this.rgb[2] < inverseThreshold
    ) {
      stroke(
        255 - this.rgb[0],
        255 - this.rgb[1],
        255 - this.rgb[2],
        this.opacity
      );
    } else if (random(1) > flash) {
      stroke(random(255), 0, 0, this.opacity);
    } else {
      stroke(
        map(this.rgb[0] + this.rgb[1] + this.rgb[2], 0, 3 * 255, 0, 255),
        0,
        map(this.x + this.y, 0, 1400, 0, 100),
        this.opacity
      );
    }
    strokeWeight(map(this.z, 550, 0, 1, 5));

    point(0, 0, 0);

    pop();
  }
}

//return index of pixel in the pixel array based on the its x and y position and the swidth of the image
function calculatePixel(x, y, w) {
  return (y - 1) * w * 4 + x * 4 - 4;
}

function calculateSegPixel(x, y, w) {
  return (y - 1) * w + x;
}
