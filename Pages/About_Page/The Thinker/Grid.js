/* ============================================================
   The Grid Class applies pixelated + text-ize effects to images
   ============================================================ */


// space between text
const XSPACING = 8;
const YSPACING = 8;

// size of new image
const GRIDWIDTH = 70 * 1.2;
const GRIDHEIGHT = 70 * 1.2;

class Grid {
  constructor(rowNum, columnNum) {

    // initializes 2D array of text objects
    this.rowNum = parseInt(rowNum);
    this.columnNum = parseInt(columnNum);
    this.grids = new Array(this.rowNum);

    for (let i = 0; i < this.rowNum; i++) {
      this.grids[i] = new Array(this.columnNum);
      for (let j = 0; j < this.columnNum; j++) {
        this.grids[i][j] = new Text({
          x: XSPACING * (j - this.columnNum / 2),
          y: YSPACING * (i - this.rowNum / 2),
          rgb: [0, 0, 0],
          letter: random([0,1]),
        });
      }
    }
  }

  // traverses through 2D array of text objects
  forEach(func) {
    for (let i = 0; i < this.rowNum; i++) {
      for (let j = 0; j < this.columnNum; j++) {
        func(i, j);
      }
    }
  }

  // set 2D array of text objects to the colors of the img
  setPic(img) {
    if(img.width !== width){
      img.pixelDensity(1);
      img.loadPixels();
    }
    this.forEach((i, j) => {
      this.grids[i][j].setPicText(img);
    });
  }
}

// calculate index in pixels array of an image based on an (x,y) position
function calculatePixel(x, y, w) {
  return (y - 1) * w * 4 + x * 4 - 4;
}