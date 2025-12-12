let triangles = [];

class Tri {
  constructor(x1, y1, x2, y2, x3, y3, r, g, b) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.r = r;
    this.g = g;
    this.b = b;
    this.alpha = 255;
  }
  
  update(x1,y1,x2,y2,x3,y3,r,g,b){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.r = r;
    this.g = g;
    this.b = b;
  }
  
  show(){
     if (random(1)>map(count,2,triangles.length,0.999,0.97) && count > 2) {
      let randShape = random([1,2,3]);
      this.r = random(0, 255);
      this.g = random(0, 255);
      this.b = random(0, 255);
      //assign a random coordinate to the one point within tri object that is selected to be distorted
      if (randShape == 1) {
        this.x1 = random(face.box.xMin, face.box.xMax);
        this.y1 = random(face.box.yMin, face.box.yMax);
      } else if (randShape == 2) {
        this.x2 = random(face.box.xMin, face.box.xMax);
        this.y2 = random(face.box.yMin, face.box.yMax);
      } else {
        this.x3 = random(face.box.xMin, face.box.xMax);
        this.y3 = random(face.box.yMin, face.box.yMax);
      }
    }
    push();
    fill(this.r, this.g, this.b,this.alpha);
      stroke("white");
    strokeWeight(0.2);
    
      beginShape();
      vertex(this.x1, this.y1);
      vertex(this.x2, this.y2);
      vertex(this.x3, this.y3);
      endShape(CLOSE);
    pop();
    }
  
}

function triArea(x1, y1, x2, y2, x3, y3) {
  let area = abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  return area;
}

function calculatePixel(x, y, w) {
  return (y - 1) * w * 4 + x * 4 - 4;
}