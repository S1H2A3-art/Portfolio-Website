class Grid {
  constructor({ x, y, z, num } = {}) {
    this.position = createVector(x, y, z);
    this.number = num;
    if (num == undefined) {
      this.number = 0;
    }
  }

  spawn() {
    this.number = round(random(99));
  }
  show() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    push();
    noFill();
    stroke(255, 255, 255, map(this.number, 0, 10, 10, 70));
    strokeWeight(map(this.number, 0, 99, 0.1, 0.3));
    box(GRIDLENGTH, GRIDLENGTH, GRIDLENGTH);
    pop();
    fill(255, 255, 255, map(this.number, 0, 10, 20, 70));
    if (this.number != 0) {
      text(str(this.number), 0, 0);
    }
    pop();
  }
}
