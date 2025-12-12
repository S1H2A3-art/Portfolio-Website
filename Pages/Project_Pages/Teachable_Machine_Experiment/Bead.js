class Bead {
  constructor({ x, y, rgb } = {}) {
    this.position = createVector(x, y);
    this.rgb = rgb;
    this.diameter = 15;
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get radius() {
    return this.diameter / 2;
  }

  updateColor(newRGB) {
    this.rgb = newRGB;
  }

  show() {
    push();
    
    strokeWeight(this.diameter);
    if (
      random(1) > inverse &&
      this.rgb[0] + this.rgb[1] + this.rgb[2] < inverseThreshold
    ) {
      stroke(255 - this.rgb[0], 255 - this.rgb[1], 255 - this.rgb[2], opacity);
      strokeWeight(this.diameter + random(-10, 10));
    } else if (random(1) > flash) {
      stroke(random(255), random(255), random(255), opacity);
      strokeWeight(this.diameter + random(-10, 10));
    } else if (random(1) > lens) {
      stroke(
        this.rgb[0] + lensAmount[0],
        this.rgb[1] + lensAmount[1],
        this.rgb[2] + lensAmount[2],
        opacity
      );
      strokeWeight(this.diameter);
    } else {
      strokeWeight(this.diameter);
      stroke(this.rgb[0], this.rgb[1], this.rgb[2], opacity);
    }
    point(
      this.position.x + random(-offset, offset),
      this.position.y + random(-offset, offset)
    );

    pop();
  }
}

//return index of pixel in the pixel array based on the its x and y position and the swidth of the image
function calculatePixel(x, y, w) {
  return (((1/2)*y - 1) * w * 4 + (1/2)*x * 4 - 4);
}
