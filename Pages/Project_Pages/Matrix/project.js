//size of each grid
const GRIDLENGTH = 40;
//size of the entire grid system
const GRIDSIZE = 800;
//3D array of grids
let grids = new Array(GRIDSIZE / GRIDLENGTH);

let font;
async function preload1() {

  showMode = "key";
  await displayBasicInformation();
  
  font = loadFont("Assets/font1.ttf");
 

}

//determines which function to perform
let mode = "";

//applies function to 3D system of grids
function updateGrids() {
  //for each grid
  for (let i = 1; i < grids.length - 1; i++) {
    for (let j = 1; j < grids[i].length - 1; j++) {
      for (let k = 1; k < grids[i][j].length - 1; k++) {
        //randomize assigns random values to random grids
        if (mode == "randomize") {
          if (random(1) > 0.999 && grids[i][j][k].number == 0) {
            grids[i][j][k].spawn();
          }
          //subtract shares numerical values to connected grids that possesses smaller values
        } else if (mode == "subtract") {
          if (grids[i][j][k].number > 1) {
            if (
              compare(i, j, k).smallerGrid != undefined &&
              compare(i, j, k).smallerGrid.length > 0
            ) {
              //smallest is the connected grid with the smallest numerical value
              let smallest = compare(i, j, k).smallerGrid[0];
              //exchanges 1 numerical value to the smaller grid
              grids[i][j][k].number--;
              grids[locate(smallest.position.x)][locate(smallest.position.y)][
                locate(smallest.position.z)
              ].number++;
            }
          }
          //add shares numerical values to connected grids that possesses larger or equal values
        } else if (mode == "add") {
          if (grids[i][j][k].number > 0) {
            if (
              compare(i, j, k).largerGrid != undefined &&
              compare(i, j, k).largerGrid.length > 0
            ) {
              let largest = compare(i, j, k).largerGrid[
                compare(i, j, k).largerGrid.length - 1
              ];

              grids[i][j][k].number--;
              grids[locate(largest.position.x)][locate(largest.position.y)][
                locate(largest.position.z)
              ].number++;
            } else if (
              compare(i, j, k).equalGrid != undefined &&
              compare(i, j, k).equalGrid.length > 0
            ) {
              let equal = compare(i, j, k).equalGrid[0];

              grids[i][j][k].number--;
              grids[locate(equal.position.x)][locate(equal.position.y)][
                locate(equal.position.z)
              ].number++;
            }
          }
        } else if (mode == "clear") {
          clear1();
        }
      }
    }
  }
}

//clear all values in the 3D array
function clear1() {
  for (let i = 0; i < grids.length; i++) {
    for (let j = 0; j < grids[i].length; j++) {
      for (let k = 0; k < grids[i][j].length; k++) {
        grids[i][j][k].number = 0;
      }
    }
  }
}
//locate the index of the grid in the 3D array of grids given the x/y/z coordinates
function locate(x) {
  return x / GRIDLENGTH;
}

//compare returns 3 sorted arrays: smallerGrid(which returns an array of connected grids that are larger than the current grid), largerGrid(which returns an array of connected grids that are larger than the current grid), and equalGrid (which returns an array of connected grids that are equal to the current grid)
function compare(i, j, k) {
  let smallerGrid = [];
  let largerGrid = [];
  let equalGrid = [];
  if (grids[i - 1][j][k].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i - 1][j][k]);
  } else if (grids[i - 1][j][k].number > grids[i][j][k].number) {
    largerGrid.push(grids[i - 1][j][k]);
  } else {
    equalGrid.push(grids[i - 1][j][k]);
  }

  if (grids[i][j - 1][k].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i][j - 1][k]);
  } else if (grids[i][j - 1][k].number > grids[i][j][k].number) {
    largerGrid.push(grids[i][j - 1][k]);
  } else {
    equalGrid.push(grids[i][j - 1][k]);
  }

  if (grids[i][j][k - 1].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i][j][k - 1]);
  } else if (grids[i][j][k - 1].number > grids[i][j][k].number) {
    largerGrid.push(grids[i][j][k - 1]);
  } else {
    equalGrid.push(grids[i][j][k - 1]);
  }

  if (grids[i + 1][j][k].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i + 1][j][k]);
  } else if (grids[i + 1][j][k].number > grids[i][j][k].number) {
    largerGrid.push(grids[i + 1][j][k]);
  } else {
    equalGrid.push(grids[i + 1][j][k]);
  }

  if (grids[i][j + 1][k].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i][j + 1][k]);
  } else if (grids[i][j + 1][k].number > grids[i][j][k].number) {
    largerGrid.push(grids[i][j + 1][k]);
  } else {
    equalGrid.push(grids[i][j + 1][k]);
  }

  if (grids[i][j][k + 1].number < grids[i][j][k].number) {
    smallerGrid.push(grids[i][j][k + 1]);
  } else if (grids[i][j][k + 1].number > grids[i][j][k].number) {
    largerGrid.push(grids[i][j][k + 1]);
  } else {
    equalGrid.push(grids[i][j][k + 1]);
  }

  return {
    smallerGrid: sort1(smallerGrid),
    largerGrid: sort1(largerGrid),
    equalGrid: equalGrid,
  };
}

//sort1 sorts arrays of grid objects from the ones that possess the lowest numerical values to the highest numerical values
function sort1(arr) {
  if (arr.length > 0) {
    let sorted = [];
    let si;
    while (true) {
      let smallest = arr[0];
      si = 0;
      for (let i = 0; i < arr.length; i++) {
        if (smallest.number > arr[i].number) {
          smallest = arr[i];
          si = i;
        }
      }
      sorted.push(smallest);
      arr.splice(si, 1);
      if (arr.length == 0) {
        return sorted;
      }
    }
  } else {
    return undefined;
  }
}

//cameraMode determines the camera angle
let cameraMode = 1;
//cam() adjusts camera angle based on the cameraMode
function cam() {
  if (cameraMode == 1) {
    let x = random(-0.2, 0.2);
    let y = random(-0.2, 0.2);
    camera(x, y, 600, 0, 0, 0);
  } else if (cameraMode == 3) {
    let x = random(-0.2, 0.2);
    let y = random(-0.2, 0.2);
    camera(-700 + x, -700 + y, 600, 0, 0, 0);
  } else if (cameraMode == 2) {
    let x = random(-0.2, 0.2);
    let y = random(-0.2, 0.2);
    camera(100 + x, 100 + y, 600, 0, 0, 0);
  } else if (cameraMode == 4) {
    let x = random(-0.0015, 0.0015);
    let y = random(-0.0015, 0.0015);
    camera(x, y, 40, 0, 0, 0);
  }
}

let buttons = [
  { name: "randomize", c: "black" },
  { name: "subtract", c: "black" },
  { name: "add", c: "black" },
  { name: "clear", c: "darkgrey" },
];
function buttonPressed() {
  mode = this.value();
}
function keyPressed(){
    keyPressedShow();
}
let canvas;
async function setup1() {
  await preload1();
  canvas = createCanvas(2000, 1400, WEBGL);
  canvas.parent(document.getElementById("projectContainer"));
  for (let i = 0; i < buttons.length; i++) {
    let c = buttons[i].c;
    let name = buttons[i].name;
    buttons[i] = createButton(name, name);
    buttons[i].parent(document.getElementById("controls"));
    buttons[i].mousePressed(buttonPressed);
    buttons[i].style("color", "c");
    buttons[i].style("background-color", "white");
    buttons[i].style("border", `0.1rem solid ${c}`);
    buttons[i].style("font-size", "2rem");
    buttons[i].style("width", "15rem");
    buttons[i].style("margin", "0.5em");
  }
  textFont(font);
  textSize(GRIDSIZE / GRIDLENGTH);
  textAlign(CENTER, CENTER);

  //sets up 3D array of grids
  for (let i = 0; i < grids.length; i++) {
    grids[i] = new Array(grids.length);
    for (let j = 0; j < grids[i].length; j++) {
      grids[i][j] = new Array(grids.length);
      for (let k = 0; k < grids[i][j].length; k++) {
        grids[i][j][k] = new Grid({
          x: i * GRIDLENGTH,
          y: j * GRIDLENGTH,
          z: k * GRIDLENGTH,
        });
      }
    }
  }
  noLoop();
}

async function draw() {
  if(frameCount==1){
    await setup1();
  }
  background("black");
  
  translate(
    -grids[floor(grids.length / 2)][0][0].position.x,
    -grids[0][floor(grids.length / 2)][0].position.y + 100,
    -grids[0][0][floor(grids.length / 2)].position.z
  );

  updateGrids();

  for (let i = 1; i < grids.length - 1; i++) {
    for (let j = 1; j < grids[i].length - 1; j++) {
      for (let k = 1; k < grids[i][j].length - 1; k++) {
        grids[i][j][k].show();
      }
    }
  }

  cam();

  //for each 150 iterations, the camera angle switches
  if (frameCount % 150 == 0) {
    cameraMode++;
    if (cameraMode > 4) {
      cameraMode = 1;
    }
  }
  orbitControl();
  showHint();
}
