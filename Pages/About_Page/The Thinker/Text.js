/* ============================================================
   The Text Class are individual "text pixels" of the pixelate+text-ize effect
   ============================================================ */

class Text {

  constructor({ x, y, rgb, letter } = {}) {
    this.size = 10; 
    this.position = createVector(x, y);
    this.rgb = createVector(rgb[0], rgb[1], rgb[2]);
    this.targetRgb = undefined;
    this.letter = letter;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  show() {
    push();
    textSize(this.size);
    translate(this.x, this.y);
    fill(this.rgb.x, this.rgb.y, this.rgb.z,180);
    text((frameCount+this.letter)%2, 0, 0);
    pop();
  }

  //set color of text object based on img
  setPicText(img) {
    const pixelX = round(this.x / 2 + img.width / 2);
    const pixelY = round(this.y / 2 + img.height / 2);
    const pixelNum = calculatePixel(pixelX, pixelY, img.width);

    if (img.pixels[pixelNum] != undefined) {
      const r = img.pixels[pixelNum];
      const g = img.pixels[pixelNum + 1];
      const b = img.pixels[pixelNum + 2];
      this.rgb = createVector(r, g, b);
    }  
  }
}
