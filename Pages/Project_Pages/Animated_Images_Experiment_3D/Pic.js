class Pic {
  constructor({ img } = {}) {
    this.img = img;
    this.beads = new Array(floor(this.img.height / 1));
    this.f = 0;
  }
  showPic() {
    for (let arr of this.beads) {
      for (let bead of arr) {
        if (bead != undefined) {
          bead.show();
        }
      }
    }
  }
  updatePic() {
    for (let arr of this.beads) {
      for (let bead of arr) {
        if (bead != undefined) {
          bead.update();
        }
      }
    }
  }
  setPic() {
    //set beads correspondingly to the pixels on the image
    this.img.loadPixels();
    for (let i = 0; i < this.beads.length; i++) {
      this.beads[i] = new Array(this.img.width);
      for (let j = 0; j < this.beads[i].length; j += 1) {
        this.f++;
        if (this.f % 16 == 0) {
          let pixelNum = calculatePixel(j, i, this.img.width / 1);
          this.beads[i][j] = new Bead({
            x: j,
            y: i,
            rgb: [
              this.img.pixels[pixelNum],
              this.img.pixels[pixelNum + 1],
              this.img.pixels[pixelNum + 2],
            ],
          });
        }
      }
    }
  }
}
