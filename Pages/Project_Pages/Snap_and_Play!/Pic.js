class Pic {
  constructor({ i, j } = {}) {
    this.beads = new Array(PICHEIGHT);
    this.position = {
      x1: i * PICWIDTH,
      y1: j * PICHEIGHT,
      x2: i * PICWIDTH + PICWIDTH,
      y2: j * PICHEIGHT + PICHEIGHT,
    };
    this.freeze = false;
    this.sum = 0;
    this.sorted = [];
  }
  get median(){
    this.sorted.sort();
   return this.sorted[floor(this.sorted.length/2)];
  }
  
  setPic() {
    randPic();  
    this.freeze = false;
    loadPixels();
    for (let i = 0; i < this.beads.length; i++) {
      this.beads[i] = new Array(PICWIDTH);
      for (let j = 0; j < this.beads[i].length; j++) {
        let pixelNum = calculatePixel(
          j + this.position.x1,
          i + this.position.y1
        );
        this.beads[i][j] = new Bead({
          x: j + this.position.x1,
          y: i + this.position.y1,
          rgb: [pixels[pixelNum], pixels[pixelNum + 1], pixels[pixelNum + 2]],
        });
        if(pixels[pixelNum]!=undefined || pixels[pixelNum + 1]!=undefined || pixels[pixelNum + 2]!=undefined){
          this.sorted.push(pixels[pixelNum] + pixels[pixelNum + 1] + pixels[pixelNum + 2]);
        }
        
      }
    }
    picMedian = this.median;
    picSorted = this.sorted;
   
  }

  picShow() {
    for (let i = 0; i < this.beads.length; i++) {
      for (let j = 0; j < this.beads[i].length; j++) {
        this.beads[i][j].show();
      }
    }
  }
}

function randPic() {
  randR = random(-40, 40);
  randG = random(-40, 40);
  randB = random(-40, 40);

  randDuotone1 = { r: random(0, 200), g: random(0, 200), b: random(0, 200) };
  randDuotone2 = {
    r: 255 - randDuotone1.r,
    g: 255 - randDuotone1.g,
    b: 255 - randDuotone1.b,
  };
}