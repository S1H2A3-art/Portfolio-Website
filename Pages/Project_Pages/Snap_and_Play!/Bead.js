class Bead {
  constructor({ x, y, rgb } = {}) {
    this.position = createVector(x, y);
    this.rgb = rgb;
    this.diameter = 1;
  }
  show() {
    push();

    let tempRGB = {
      tempR: this.rgb[0],
      tempG: this.rgb[1],
      tempB: this.rgb[2],
    };
    if (mode == "inverse") {
      tempRGB.tempR = inverse(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).r;
      tempRGB.tempG = inverse(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).g;
      tempRGB.tempB = inverse(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).b;
    } else if (mode == "colorize") {
      tempRGB.tempR = colorize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).r;
      tempRGB.tempG = colorize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).g;
      tempRGB.tempB = colorize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).b;
    } else if (mode == "grain") {
      tempRGB.tempR = grain(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).r;
      tempRGB.tempG = grain(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).g;
      tempRGB.tempB = grain(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).b;
    } else if (mode == "posterize") {
      tempRGB.tempR = posterize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).r;
      tempRGB.tempG = posterize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).g;
      tempRGB.tempB = posterize(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).b;
    } else if (mode == "duotone") {
      tempRGB.tempR = duotone(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).r;
      tempRGB.tempG = duotone(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).g;
      tempRGB.tempB = duotone(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB).b;
    }
    fill(tempRGB.tempR, tempRGB.tempG, tempRGB.tempB);
    noStroke();
    square(this.position.x - 1, this.position.y - 1, this.diameter);

    pop();
  }
}

function inverse(r, g, b) {
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;
  return { r: r, g: g, b: b };
}
function grain(r, g, b) {
  return {
    r: r + random(-40, 40),
    g: g + random(-40, 40),
    b: b + random(-40, 40),
  };
}
function posterize(r, g, b) {
  let r1 = r;
  let g1 = g;
  let b1 = b;

  if (r1 + g1 + b1 <= picSorted[floor(picSorted.length / 5)]) {
    r1 = 0;
    g1 = 0;
    b1 = 0;
  } else if (r1 + g1 + b1 <= picSorted[2 * floor(picSorted.length / 5)]) {
    r1 = 255 / 4;
    g1 = 255 / 4;
    b1 = 255 / 4;
  } else if (r1 + g1 + b1 <= picSorted[3 * floor(picSorted.length / 5)]) {
    r1 = (2 * 255) / 4;
    g1 = (2 * 255) / 4;
    b1 = (2 * 255) / 4;
  } else if (r1 + g1 + b1 <= picSorted[4 * floor(picSorted.length / 5)]) {
    r1 = (3 * 255) / 4;
    g1 = (3 * 255) / 4;
    b1 = (3 * 255) / 4;
  } else {
    r1 = 255;
    g1 = 255;
    b1 = 255;
  }
  return { r: r1, g: g1, b: b1 };
}

let randR;
let randG;
let randB;
function colorize(r, g, b) {
  return { r: r + randR, g: g + randG, b: b + randB };
}

let randDuotone1;
let randDuotone2;
function duotone(r, g, b) {
  if (r + g + b <= picMedian) {
    return randDuotone1;
  } else {
    return randDuotone2;
  }
}
