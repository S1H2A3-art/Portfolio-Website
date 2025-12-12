//function that caculates the area of a triangle given its coordinates
function triArea(x1, y1, x2, y2, x3, y3) {
  let area = abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  return area;
}
//function that turns the opacity of a tri object to min
function disappear(x) {
  x.alpha = 0;
}
//function that turns the opacity of a tri object to max
function appear(x) {
  x.alpha = 255;
}
//function that draws random transparent quadrilateral given the stroke weight and the ranges for its coordinates to simulate flashing effects
function drawQuad(strokeW, xmin, xmax, ymin, ymax) {
  stroke(random(0, 255), random(0, 255), random(0, 255), random(0, 255));

  strokeWeight(strokeW/800*minLength);
  noFill();
  quad(
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength),
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength),
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength),
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength)
  );
}
//function that draws random triangles given the ranges for its coordinates to simulate flashing effects
function drawTri(xmin, xmax, ymin, ymax) {
  fill(random(0, 255), random(0, 255), random(0, 255), random(0, 255));

  noStroke();
  triangle(
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength),
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength),
    random(xmin/800*minLength+translateL, xmax/800*minLength+translateL),
    random(ymin/800*minLength, ymax/800*minLength)
  );
}
async function preload1(){
  await displayBasicInformation();
}
let canvas;
async function setup1() {
await preload1();
canvas = createCanvas(2000, 1400);


  noLoop();
  
  canvas.parent(document.getElementById("projectContainer"));
  if(width > height){
 minLength = height;
}else{
  minLength = width;
}
  translateL = (width/2-400/800*minLength);
}

let count = 0; //count number of triangles removed

//properties of tri object stored locally so they can be manipulated when the draw function is running without changing the object itself
let r;
let g;
let b;
let x1;
let x2;
let x3;
let y1;
let y2;
let y3;
let minLength;
let translateL;

async function draw() {
  if(frameCount===1){
    await setup1();
    return;
  }
    window.addEventListener("keydown", function(e) {
  // Check if the pressed key is an arrow key or the spacebar
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
    e.preventDefault(); // Prevent the default scrolling behavior
  }
}, false);

  frameRate(10 + 0.1 * count);//as more triangles are removed, the flashing effect will occur at a faster rate
  background(0);
  textSize(15/800*minLength);
  fill(144);
text("Move your mouse", 382/800*minLength+translateL, 730/800*minLength);
   textSize(40/800*minLength);
  text("Flash Warning", 320/800*minLength+translateL, 770/800*minLength);
  //flashing effects gradually accumulate as more triangles are removed
  if (count > 10) {
    drawQuad(2, 385, 485, 385, 485);
    if (count > 15) {
      drawQuad(2, 335, 535, 335, 535);
      if (count > 20) {
        drawTri(235, 635, 235, 635);
        if (count > 25) {
          drawQuad(2, 235, 635, 235, 635);
          if (count > 35) {
            drawTri(235, 635, 235, 635);
            if (count > 50) {
              drawTri(235, 635, 0, 635);
              if (count > 65) {
                drawTri(235, 635, 0, 635);
              }
              if (count > 80) {
                drawTri(235, 635, 0, 635);
                if (count > 100) {
                  drawTri(235, 635, 0, 635);
                  drawQuad(2, 235, 635, 235, 635);
                  if (count > 110) {
                    drawTri(235, 635, 0, 635);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  //random variable that selects a tri object to distort
  let rand = round(random(0, triangles.length));
  //random variable that selects one of the 3 points within a tri object to distort
  let randShape = round(random(1, 3));

  for (let i = 0; i < triangles.length; i++) {
    stroke("white");
    strokeWeight(0.1/800*minLength);
    x1 = triangles[i].x1;
    x2 = triangles[i].x2;
    x3 = triangles[i].x3;
    y1 = triangles[i].y1;
    y2 = triangles[i].y2;
    y3 = triangles[i].y3;
    r = triangles[i].r;
    g = triangles[i].g;
    b = triangles[i].b;
    //assign a random color to the tri object that is selected to be distorted
    if (i == rand && count > 2) {
      r = random(0, 255);
      g = random(0, 255);
      b = random(0, 255);
      //assign a random coordinate to the one point within tri object that is selected to be distorted
      if (randShape == 1) {
        x1 = random(200, 600);
        y1 = random(200, 600);
      } else if (randShape == 2) {
        x2 = random(200, 600);
        y2 = random(200, 600);
      } else {
        x3 = random(200, 600);
        y3 = random(200, 600);
      }
    }
    x1 = x1/800*minLength+translateL;
    x2 = x2/800*minLength+translateL;
    x3 = x3/800*minLength+translateL;
    y1 = y1/800*minLength;
    y2 = y2/800*minLength;
    y3 = y3/800*minLength;
    //draw the triangles
    fill(r, g, b, triangles[i].alpha);

    triangle(x1, y1, x2, y2, x3, y3);
    //check if mouse is hovering above a triangle. The sum of the area of the three triangles created by connecting the verticies of a triangle with any point inside the triangle is always equal to the area of the triangle itself. The program thus considers if the sum of the three smaller triangles is the same as the area of the big triangle in order to check if the mouse is hovering above a triangle. More information can be found this on the blog post.
    let checkTri =
      triArea(
        mouseX,
        mouseY,
        x1,
        y1,
        x2,
        y2
      ) +
      triArea(
        mouseX,
        mouseY,
        x2,
        y2,
        x3,
        y3
      ) +
      triArea(
        mouseX,
        mouseY,
        x1,
        y1,
        x3,
        y3
      );
    
    if (
      //if the two areas are identical(a 0.01 margin of error is acceptable because of the way decimals are stored) and the triangle is still visible, make the triangle transparent and add one to count. More information on the blog post.
      abs(checkTri-
        triArea(
          x1,
          y1,
          x2,
          y2,
          x3,
          y3
        )) < 0.01 &&
      triangles[i].alpha == 255
    ) {
      disappear(triangles[i]);
      count++;
    }
    //if the number of the triangles that disappeared is 10 less than the total number of triangles, reset everything
    if (count >= triangles.length-10) {
      for (let i = 0; i < triangles.length; i++) {
        appear(triangles[i]);
      }
      count = 0;
    }
  }
  showHint(40);
}

class tri {
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
}

//I decided to create a class of tri objects to store the properties of the triangles in a more organized way since there are more than 200 triangles. I also decided to create an array for the triangles so that I can access them easily through a single list. These are the only things that I remember about computer programming from AP Computer Science Principles A however. 


let triangles = [];

//Everything else below is the individual tri object stored in the array
triangles[0] = new tri(227.07, 0, 154.47, 160.68, 227.07, 234.17, 0, 0, 0);
triangles[1] = new tri(
  154.47,
  160.68,
  227.07,
  234.17,
  164.31,
  260.95,
  10,
  8,
  9
);
triangles[2] = new tri(
  200.64,
  328.71,
  227.07,
  234.17,
  164.31,
  260.95,
  13,
  11,
  12
);
triangles[3] = new tri(
  200.64,
  328.71,
  214.79,
  409.85,
  164.31,
  260.95,
  10,
  7,
  6
);
triangles[4] = new tri(
  200.64,
  328.71,
  214.79,
  409.85,
  164.31,
  260.95,
  10,
  7,
  6
);
triangles[5] = new tri(
  164.31,
  260.95,
  200.64,
  328.71,
  214.79,
  409.85,
  11,
  6,
  6
);
triangles[6] = new tri(
  277.39,
  459.5,
  200.64,
  328.71,
  214.79,
  409.85,
  65,
  50,
  37
);
triangles[7] = new tri(
  239.01,
  394.1,
  200.64,
  328.71,
  227.07,
  234.17,
  19,
  12,
  7
);
triangles[8] = new tri(214.79, 409.85, 239.25, 489, 277.39, 459.5, 74, 55, 41);
triangles[9] = new tri(297.85, 579.59, 239.25, 489, 277.39, 459.5, 77, 58, 44);
triangles[10] = new tri(
  297.85,
  579.59,
  360.51,
  453.87,
  277.39,
  459.5,
  114,
  85,
  65
);
triangles[11] = new tri(
  367.4,
  473.46,
  360.51,
  453.87,
  344.46,
  486.07,
  123,
  92,
  72
);
triangles[12] = new tri(
  367.4,
  473.46,
  360.51,
  453.87,
  385.13,
  452.2,
  106,
  79,
  63
);
triangles[13] = new tri(
  367.4,
  473.46,
  419.06,
  481.15,
  385.13,
  452.2,
  111,
  82,
  68
);
triangles[14] = new tri(
  367.4,
  473.46,
  419.06,
  481.15,
  371.31,
  502.14,
  121,
  91,
  75
);
triangles[15] = new tri(
  367.4,
  473.46,
  344.46,
  486.07,
  372.82,
  513.16,
  110,
  74,
  54
);
triangles[16] = new tri(
  297.85,
  579.59,
  344.46,
  486.07,
  372.82,
  513.16,
  121,
  89,
  64
);
triangles[17] = new tri(
  297.85,
  579.59,
  344.46,
  538.29,
  365.32,
  650.34,
  91,
  68,
  52
);
triangles[18] = new tri(
  372.82,
  513.16,
  344.46,
  538.29,
  351.15,
  574.25,
  116,
  89,
  68
);
triangles[19] = new tri(
  372.82,
  513.16,
  386.7,
  512.25,
  351.15,
  574.25,
  123,
  94,
  75
);
triangles[20] = new tri(
  372.82,
  513.16,
  386.7,
  512.25,
  371.31,
  502.14,
  102,
  74,
  57
);
triangles[21] = new tri(
  401.21,
  489,
  386.7,
  512.25,
  371.31,
  502.14,
  118,
  90,
  73
);
triangles[22] = new tri(
  351.15,
  574.25,
  386.7,
  512.25,
  415.68,
  509.89,
  117,
  90,
  69
);
triangles[23] = new tri(
  351.15,
  574.25,
  393.23,
  571.01,
  415.68,
  509.89,
  111,
  86,
  65
);
triangles[24] = new tri(
  413.49,
  569.13,
  393.23,
  571.01,
  415.68,
  509.89,
  125,
  96,
  74
);
triangles[25] = new tri(
  413.49,
  569.13,
  426.79,
  519.54,
  415.68,
  509.89,
  137,
  107,
  83
);
triangles[26] = new tri(
  413.49,
  569.13,
  426.79,
  519.54,
  454.76,
  563.87,
  134,
  104,
  81
);
triangles[27] = new tri(
  442.25,
  521.27,
  426.79,
  519.54,
  454.76,
  563.87,
  133,
  103,
  79
);
triangles[28] = new tri(
  442.25,
  521.27,
  486.54,
  512.25,
  454.76,
  563.87,
  142,
  109,
  83
);
triangles[29] = new tri(
  494.74,
  576.88,
  486.54,
  512.25,
  454.76,
  563.87,
  144,
  113,
  86
);
triangles[30] = new tri(
  494.74,
  576.88,
  486.54,
  512.25,
  518.29,
  563.87,
  145,
  114,
  84
);
triangles[31] = new tri(
  507.73,
  509.89,
  486.54,
  512.25,
  518.29,
  563.87,
  156,
  121,
  91
);
triangles[32] = new tri(
  507.73,
  509.89,
  567.51,
  576.88,
  518.29,
  563.87,
  148,
  116,
  87
);
triangles[33] = new tri(
  516.5,
  576.88,
  567.51,
  576.88,
  518.29,
  563.87,
  132,
  105,
  78
);
triangles[34] = new tri(
  516.5,
  576.88,
  494.74,
  576.88,
  518.29,
  563.87,
  118,
  89,
  72
);
triangles[35] = new tri(
  516.5,
  576.88,
  494.74,
  576.88,
  535.24,
  618.29,
  134,
  104,
  78
);
triangles[36] = new tri(
  516.5,
  576.88,
  567.51,
  576.88,
  535.24,
  618.29,
  124,
  97,
  73
);
triangles[37] = new tri(
  484.18,
  609.45,
  494.74,
  576.88,
  535.24,
  618.29,
  124,
  94,
  70
);
triangles[38] = new tri(
  484.18,
  609.45,
  486.54,
  665.32,
  535.24,
  618.29,
  133,
  102,
  76
);
triangles[39] = new tri(
  484.18,
  609.45,
  486.54,
  665.32,
  456.53,
  676.11,
  128,
  96,
  69
);
triangles[40] = new tri(
  484.18,
  609.45,
  428.88,
  618.29,
  456.53,
  676.11,
  138,
  103,
  79
);
triangles[41] = new tri(
  400,
  672.25,
  428.88,
  618.29,
  456.53,
  676.11,
  133,
  100,
  77
);
triangles[42] = new tri(
  400,
  672.25,
  428.88,
  618.29,
  365.32,
  650.34,
  123,
  92,
  71
);
triangles[43] = new tri(
  386.26,
  604.51,
  428.88,
  618.29,
  365.32,
  650.34,
  117,
  90,
  68
);
triangles[44] = new tri(
  386.26,
  604.51,
  371.31,
  579.59,
  365.32,
  650.34,
  100,
  77,
  57
);
triangles[45] = new tri(
  351.15,
  574.25,
  371.31,
  579.59,
  365.32,
  650.34,
  96,
  74,
  53
);
triangles[46] = new tri(
  351.15,
  574.25,
  371.31,
  579.59,
  413.49,
  569.13,
  77,
  49,
  37
);
triangles[47] = new tri(
  386.26,
  604.51,
  371.31,
  579.59,
  420.14,
  586.03,
  93,
  64,
  49
);
triangles[48] = new tri(
  392.4,
  574.36,
  371.31,
  579.59,
  420.14,
  586.03,
  79,
  51,
  38
);
triangles[49] = new tri(
  392.4,
  574.36,
  413.49,
  569.13,
  420.14,
  586.03,
  103,
  70,
  55
);
triangles[50] = new tri(
  454.76,
  563.87,
  413.49,
  569.13,
  420.14,
  586.03,
  121,
  83,
  69
);
triangles[51] = new tri(
  454.76,
  563.87,
  443.47,
  589.88,
  420.14,
  586.03,
  110,
  71,
  61
);
triangles[52] = new tri(
  454.76,
  563.87,
  443.47,
  589.88,
  494.74,
  576.88,
  113,
  78,
  62
);
triangles[53] = new tri(
  484.18,
  609.45,
  443.47,
  589.88,
  494.74,
  576.88,
  135,
  91,
  78
);
triangles[54] = new tri(
  484.18,
  609.45,
  433.55,
  609.2,
  428.88,
  618.29,
  106,
  74,
  55
);
triangles[55] = new tri(
  443.47,
  589.88,
  386.26,
  604.51,
  428.88,
  618.29,
  128,
  86,
  72
);
triangles[56] = new tri(
  443.47,
  589.88,
  386.26,
  604.51,
  420.14,
  586.03,
  132,
  89,
  77
);
triangles[57] = new tri(
  443.47,
  589.88,
  484.18,
  609.45,
  428.88,
  618.29,
  132,
  92,
  77
);
triangles[58] = new tri(
  442.25,
  521.27,
  448.93,
  516.73,
  486.54,
  512.25,
  116,
  87,
  65
);
triangles[59] = new tri(
  462.1,
  504.04,
  448.93,
  516.73,
  486.54,
  512.25,
  112,
  82,
  61
);
triangles[60] = new tri(
  462.1,
  504.04,
  476.5,
  503.06,
  486.54,
  512.25,
  99,
  70,
  47
);
triangles[61] = new tri(
  462.1,
  504.04,
  476.5,
  503.06,
  463.1,
  434.79,
  149,
  113,
  89
);
triangles[62] = new tri(
  502.42,
  489,
  476.5,
  503.06,
  463.1,
  434.79,
  156,
  120,
  96
);
triangles[63] = new tri(
  502.42,
  489,
  476.5,
  503.06,
  486.54,
  512.25,
  142,
  108,
  83
);
triangles[64] = new tri(
  502.42,
  489,
  507.73,
  509.89,
  486.54,
  512.25,
  127,
  92,
  68
);
triangles[65] = new tri(
  502.42,
  489,
  507.73,
  509.89,
  593.94,
  502.14,
  160,
  123,
  93
);
triangles[66] = new tri(
  502.42,
  489,
  480.35,
  361.66,
  593.94,
  502.14,
  165,
  128,
  99
);
triangles[67] = new tri(
  507.73,
  509.89,
  567.51,
  576.88,
  593.94,
  502.14,
  146,
  112,
  86
);
triangles[68] = new tri(
  624.26,
  503.06,
  567.51,
  576.88,
  593.94,
  502.14,
  116,
  93,
  74
);
triangles[69] = new tri(
  624.26,
  503.06,
  559.66,
  394.1,
  593.94,
  502.14,
  156,
  121,
  94
);
triangles[70] = new tri(
  480.35,
  361.66,
  559.66,
  394.1,
  593.94,
  502.14,
  165,
  127,
  98
);
triangles[71] = new tri(
  480.35,
  361.66,
  502.42,
  489,
  464.4,
  344.5,
  144,
  112,
  83
);
triangles[72] = new tri(463.1, 434.79, 502.42, 489, 464.4, 344.5, 154, 119, 91);
triangles[73] = new tri(
  462.1,
  504.04,
  415.26,
  327.48,
  464.4,
  344.5,
  150,
  115,
  89
);
triangles[74] = new tri(
  462.1,
  504.04,
  415.26,
  327.48,
  419.06,
  481.15,
  153,
  117,
  95
);
triangles[75] = new tri(
  462.1,
  504.04,
  424.85,
  509.89,
  419.06,
  481.15,
  147,
  112,
  88
);
triangles[76] = new tri(
  462.1,
  504.04,
  424.85,
  509.89,
  448.93,
  516.73,
  122,
  93,
  71
);
triangles[77] = new tri(
  442.85,
  509.89,
  424.85,
  509.89,
  448.93,
  516.73,
  113,
  85,
  61
);
triangles[78] = new tri(
  442.85,
  509.89,
  424.85,
  509.89,
  426.79,
  519.54,
  108,
  80,
  58
);
triangles[79] = new tri(
  419.06,
  481.15,
  415.68,
  509.89,
  426.79,
  519.54,
  121,
  90,
  70
);
triangles[80] = new tri(
  419.06,
  481.15,
  415.68,
  509.89,
  401.21,
  489,
  133,
  100,
  82
);
triangles[81] = new tri(
  393.01,
  502.14,
  415.68,
  509.89,
  401.21,
  489,
  118,
  89,
  71
);
triangles[82] = new tri(
  393.01,
  502.14,
  415.68,
  509.89,
  386.7,
  512.25,
  94,
  67,
  48
);
triangles[83] = new tri(
  396.51,
  355.81,
  415.26,
  327.48,
  419.06,
  481.15,
  131,
  100,
  78
);
triangles[84] = new tri(
  396.51,
  355.81,
  385.13,
  452.2,
  419.06,
  481.15,
  110,
  80,
  64
);
triangles[85] = new tri(
  396.51,
  355.81,
  385.13,
  452.2,
  351.34,
  398.58,
  109,
  80,
  62
);
triangles[86] = new tri(
  277.39,
  459.5,
  385.13,
  452.2,
  351.34,
  398.58,
  127,
  97,
  77
);
triangles[87] = new tri(
  277.39,
  459.5,
  304.17,
  372.35,
  351.34,
  398.58,
  111,
  85,
  65
);
triangles[88] = new tri(
  277.39,
  459.5,
  304.17,
  372.35,
  277.39,
  367.82,
  86,
  64,
  48
);
triangles[89] = new tri(
  277.39,
  459.5,
  239.01,
  394.1,
  277.39,
  367.82,
  98,
  77,
  60
);
triangles[90] = new tri(
  233.29,
  317.51,
  239.01,
  394.1,
  277.39,
  367.82,
  71,
  53,
  41
);
triangles[91] = new tri(
  251.53,
  338.32,
  269.52,
  334.11,
  277.39,
  367.82,
  50,
  33,
  25
);
triangles[92] = new tri(
  273.45,
  350.97,
  304.17,
  372.35,
  277.39,
  367.82,
  61,
  39,
  28
);
triangles[93] = new tri(
  273.45,
  350.97,
  304.17,
  372.35,
  269.52,
  334.11,
  75,
  57,
  50
);
triangles[94] = new tri(
  304.17,
  352.85,
  304.17,
  372.35,
  269.52,
  334.11,
  94,
  81,
  70
);
triangles[95] = new tri(
  304.17,
  352.85,
  304.17,
  372.35,
  319.93,
  358.76,
  112,
  100,
  91
);
triangles[96] = new tri(
  343.33,
  366.26,
  304.17,
  372.35,
  319.93,
  358.76,
  110,
  94,
  80
);
triangles[97] = new tri(
  343.33,
  366.26,
  304.17,
  372.35,
  351.34,
  398.58,
  97,
  71,
  54
);
triangles[98] = new tri(
  343.33,
  366.26,
  368.13,
  358.62,
  351.34,
  398.58,
  105,
  79,
  62
);
triangles[99] = new tri(
  343.33,
  366.26,
  368.13,
  358.62,
  350,
  347.53,
  85,
  61,
  45
);
triangles[100] = new tri(
  343.33,
  366.26,
  334.51,
  350.97,
  350,
  347.53,
  114,
  98,
  83
);
triangles[101] = new tri(
  343.33,
  366.26,
  334.51,
  350.97,
  319.93,
  358.76,
  121,
  104,
  90
);
triangles[102] = new tri(
  304.17,
  352.85,
  334.51,
  350.97,
  319.93,
  358.76,
  36,
  28,
  19
);
triangles[103] = new tri(
  304.17,
  352.85,
  334.51,
  350.97,
  340.08,
  330.98,
  34,
  24,
  15
);
triangles[104] = new tri(
  304.17,
  352.85,
  297.85,
  327.48,
  340.08,
  330.98,
  24,
  14,
  12
);
triangles[105] = new tri(
  304.17,
  352.85,
  297.85,
  327.48,
  269.52,
  334.11,
  73,
  61,
  54
);
triangles[106] = new tri(
  324.05,
  321.35,
  297.85,
  327.48,
  269.52,
  334.11,
  47,
  33,
  22
);
triangles[107] = new tri(
  340.08,
  330.98,
  334.51,
  350.97,
  350,
  347.53,
  109,
  92,
  77
);
triangles[108] = new tri(
  340.08,
  330.98,
  362.6,
  342.29,
  350,
  347.53,
  74,
  51,
  37
);
triangles[109] = new tri(
  368.13,
  358.62,
  362.6,
  342.29,
  350,
  347.53,
  92,
  69,
  53
);
triangles[110] = new tri(
  368.13,
  358.62,
  362.6,
  342.29,
  396.51,
  355.81,
  102,
  79,
  59
);
triangles[111] = new tri(
  368.13,
  358.62,
  351.34,
  398.58,
  396.51,
  355.81,
  111,
  86,
  67
);
triangles[112] = new tri(
  385.13,
  317.51,
  362.6,
  342.29,
  396.51,
  355.81,
  95,
  70,
  55
);
triangles[113] = new tri(
  385.13,
  317.51,
  362.6,
  342.29,
  353.82,
  319.48,
  88,
  65,
  48
);
triangles[114] = new tri(
  324.05,
  321.35,
  362.6,
  342.29,
  353.82,
  319.48,
  105,
  82,
  63
);
triangles[115] = new tri(
  324.05,
  321.35,
  385.13,
  317.51,
  314.88,
  297.91,
  91,
  70,
  49
);
triangles[116] = new tri(
  324.05,
  321.35,
  275.68,
  322.92,
  314.88,
  297.91,
  94,
  75,
  56
);
triangles[117] = new tri(
  324.05,
  321.35,
  275.68,
  322.92,
  251.53,
  338.32,
  43,
  29,
  20
);
triangles[118] = new tri(
  314.88,
  297.91,
  233.29,
  317.51,
  251.53,
  338.32,
  85,
  66,
  49
);
triangles[119] = new tri(
  314.88,
  297.91,
  233.29,
  317.51,
  230.1,
  274.83,
  69,
  53,
  40
);
triangles[120] = new tri(
  314.88,
  297.91,
  258.2,
  253.88,
  230.1,
  274.83,
  37,
  27,
  24
);
triangles[121] = new tri(
  314.88,
  297.91,
  258.2,
  253.88,
  346.86,
  286.9,
  46,
  31,
  22
);
triangles[122] = new tri(
  314.88,
  297.91,
  385.13,
  317.51,
  346.86,
  286.9,
  52,
  37,
  26
);
triangles[123] = new tri(
  396.51,
  355.81,
  385.13,
  317.51,
  415.26,
  327.48,
  108,
  81,
  61
);
triangles[124] = new tri(
  457.27,
  302.21,
  385.13,
  317.51,
  415.26,
  327.48,
  140,
  106,
  84
);
triangles[125] = new tri(
  457.27,
  302.21,
  464.4,
  344.5,
  415.26,
  327.48,
  137,
  103,
  81
);
triangles[126] = new tri(
  512.26,
  321.35,
  464.4,
  344.5,
  489.46,
  293.06,
  125,
  96,
  74
);
triangles[127] = new tri(
  512.26,
  321.35,
  541.04,
  316.27,
  489.46,
  293.06,
  122,
  98,
  75
);
triangles[128] = new tri(
  457.27,
  302.21,
  464.4,
  344.5,
  489.46,
  293.06,
  121,
  92,
  70
);
triangles[129] = new tri(
  544.81,
  283.79,
  541.04,
  316.27,
  489.46,
  293.06,
  109,
  87,
  64
);
triangles[130] = new tri(
  512.26,
  321.35,
  541.04,
  316.27,
  525.15,
  345.1,
  36,
  27,
  22
);
triangles[131] = new tri(
  543.05,
  351.92,
  541.04,
  316.27,
  525.15,
  345.1,
  42,
  33,
  27
);
triangles[132] = new tri(
  543.05,
  351.92,
  541.04,
  316.27,
  558.55,
  318.78,
  45,
  37,
  28
);
triangles[133] = new tri(
  543.05,
  351.92,
  559.66,
  338.45,
  558.55,
  318.78,
  52,
  44,
  35
);
triangles[134] = new tri(
  577.11,
  340.24,
  559.66,
  338.45,
  558.55,
  318.78,
  147,
  133,
  115
);
triangles[135] = new tri(
  512.26,
  321.35,
  535.01,
  363.25,
  525.15,
  361.66,
  144,
  118,
  96
);
triangles[136] = new tri(
  512.26,
  321.35,
  489.46,
  350.16,
  525.15,
  361.66,
  139,
  116,
  96
);
triangles[137] = new tri(
  560.94,
  358.73,
  535.01,
  363.25,
  525.15,
  345.1,
  145,
  120,
  98
);
triangles[138] = new tri(
  560.94,
  358.73,
  559.66,
  338.45,
  543.05,
  351.92,
  146,
  126,
  104
);
triangles[139] = new tri(
  560.94,
  358.73,
  559.66,
  338.45,
  589.37,
  341.51,
  144,
  124,
  101
);
triangles[140] = new tri(
  512.26,
  321.35,
  464.4,
  344.5,
  480.35,
  361.66,
  128,
  99,
  74
);
triangles[141] = new tri(
  489.46,
  350.16,
  525.15,
  361.66,
  480.35,
  361.66,
  135,
  105,
  84
);
triangles[142] = new tri(
  559.66,
  394.1,
  525.15,
  361.66,
  480.35,
  361.66,
  141,
  105,
  82
);
triangles[143] = new tri(
  559.66,
  394.1,
  593.94,
  502.14,
  480.35,
  361.66,
  165,
  128,
  97
);
triangles[144] = new tri(
  559.66,
  394.1,
  525.15,
  361.66,
  653.58,
  382.42,
  146,
  115,
  86
);
triangles[145] = new tri(
  559.66,
  394.1,
  653.58,
  382.42,
  624.26,
  503.06,
  137,
  109,
  85
);
triangles[146] = new tri(
  535.01,
  363.25,
  560.94,
  358.73,
  549.26,
  365.56,
  135,
  104,
  80
);
triangles[147] = new tri(
  583.1,
  371.03,
  614.4,
  327.48,
  549.26,
  365.56,
  135,
  108,
  81
);
triangles[148] = new tri(
  583.1,
  371.03,
  614.4,
  327.48,
  653.58,
  382.42,
  154,
  123,
  93
);
triangles[149] = new tri(
  662.12,
  328.65,
  614.4,
  327.48,
  653.58,
  382.42,
  139,
  108,
  82
);
triangles[150] = new tri(
  541.04,
  316.27,
  542.09,
  307.2,
  558.55,
  318.78,
  99,
  83,
  62
);
triangles[151] = new tri(
  577.11,
  307.2,
  542.09,
  307.2,
  558.55,
  318.78,
  119,
  97,
  75
);
triangles[152] = new tri(
  577.11,
  307.2,
  592.68,
  323.13,
  558.55,
  318.78,
  91,
  73,
  57
);
triangles[153] = new tri(
  567.83,
  328.65,
  592.68,
  323.13,
  558.55,
  318.78,
  62,
  49,
  38
);
triangles[154] = new tri(
  567.83,
  328.65,
  592.68,
  323.13,
  589.37,
  341.51,
  111,
  87,
  69
);
triangles[155] = new tri(
  567.83,
  328.65,
  577.11,
  340.24,
  589.37,
  341.51,
  110,
  78,
  68
);
triangles[156] = new tri(
  592.68,
  323.13,
  614.4,
  327.48,
  589.37,
  341.51,
  100,
  76,
  57
);
triangles[157] = new tri(
  592.68,
  323.13,
  614.4,
  327.48,
  598.01,
  312.99,
  119,
  95,
  72
);
triangles[158] = new tri(
  592.68,
  323.13,
  577.11,
  307.2,
  598.01,
  312.99,
  99,
  78,
  57
);
triangles[159] = new tri(
  571.51,
  272.54,
  577.11,
  307.2,
  598.01,
  312.99,
  131,
  105,
  80
);
triangles[160] = new tri(
  571.51,
  272.54,
  577.11,
  307.2,
  544.81,
  283.79,
  116,
  93,
  69
);
triangles[161] = new tri(
  542.09,
  307.2,
  577.11,
  307.2,
  544.81,
  283.79,
  121,
  97,
  71
);
triangles[162] = new tri(
  571.51,
  272.54,
  543.05,
  260.02,
  544.81,
  283.79,
  62,
  48,
  38
);
triangles[163] = new tri(
  489.46,
  293.06,
  543.05,
  260.02,
  544.81,
  283.79,
  57,
  43,
  32
);
triangles[164] = new tri(
  489.46,
  293.06,
  543.05,
  260.02,
  485.57,
  281.69,
  76,
  60,
  46
);
triangles[165] = new tri(
  454.76,
  191.68,
  543.05,
  260.02,
  485.57,
  281.69,
  148,
  114,
  87
);
triangles[166] = new tri(
  662.12,
  328.65,
  688.12,
  285.42,
  653.58,
  382.42,
  46,
  37,
  32
);
triangles[167] = new tri(
  662.12,
  328.65,
  662.12,
  267.88,
  730.64,
  214.71,
  35,
  30,
  25
);
triangles[168] = new tri(
  662.12,
  328.65,
  662.12,
  267.88,
  605.6,
  295.49,
  119,
  96,
  75
);
triangles[169] = new tri(
  662.12,
  328.65,
  614.4,
  327.48,
  605.6,
  295.49,
  139,
  112,
  84
);
triangles[170] = new tri(
  598.01,
  267.88,
  614.4,
  327.48,
  598.01,
  312.99,
  126,
  101,
  78
);
triangles[171] = new tri(
  598.01,
  267.88,
  571.51,
  272.54,
  598.01,
  312.99,
  120,
  96,
  72
);
triangles[172] = new tri(
  598.01,
  267.88,
  571.51,
  272.54,
  608.17,
  245.08,
  70,
  57,
  43
);
triangles[173] = new tri(
  598.01,
  267.88,
  605.6,
  295.49,
  608.17,
  245.08,
  70,
  55,
  41
);
triangles[174] = new tri(
  662.12,
  267.88,
  605.6,
  295.49,
  608.17,
  245.08,
  100,
  83,
  63
);
triangles[175] = new tri(
  662.12,
  267.88,
  600.96,
  109.49,
  608.17,
  245.08,
  116,
  93,
  71
);
triangles[176] = new tri(662.12, 267.88, 600.96, 109.49, 693.71, 0, 24, 19, 17);
triangles[177] = new tri(662.12, 267.88, 730.64, 109.49, 693.71, 0, 27, 22, 20);
triangles[178] = new tri(
  662.12,
  267.88,
  730.64,
  109.49,
  730.64,
  214.71,
  16,
  11,
  8
);
triangles[179] = new tri(600.96, 109.49, 590.59, 0, 693.72, 0, 30, 24, 22);
triangles[180] = new tri(600.96, 109.49, 590.59, 0, 581.73, 128.83, 33, 25, 21);
triangles[181] = new tri(
  600.96,
  109.49,
  608.17,
  245.08,
  581.73,
  128.83,
  47,
  36,
  29
);
triangles[182] = new tri(
  542.09,
  232.63,
  608.17,
  245.08,
  581.73,
  128.83,
  97,
  77,
  57
);
triangles[182] = new tri(
  542.09,
  232.63,
  608.17,
  245.08,
  543.05,
  260.02,
  69,
  55,
  40
);
triangles[183] = new tri(
  571.51,
  272.54,
  608.17,
  245.08,
  543.05,
  260.02,
  65,
  52,
  39
);
triangles[183] = new tri(
  489.46,
  293.06,
  457.27,
  302.21,
  454.76,
  191.68,
  144,
  111,
  84
);
triangles[184] = new tri(
  385.13,
  317.51,
  457.27,
  302.21,
  454.76,
  191.68,
  142,
  108,
  82
);
triangles[185] = new tri(
  385.13,
  317.51,
  340.08,
  180.04,
  454.76,
  191.68,
  146,
  113,
  86
);
triangles[186] = new tri(
  385.13,
  317.51,
  340.08,
  180.04,
  346.86,
  286.9,
  124,
  94,
  72
);
triangles[187] = new tri(
  258.2,
  253.88,
  340.08,
  180.04,
  346.86,
  286.9,
  98,
  74,
  54
);
triangles[188] = new tri(
  258.2,
  253.88,
  340.08,
  180.04,
  227.07,
  234.17,
  75,
  55,
  42
);
triangles[189] = new tri(
  258.2,
  253.88,
  230.1,
  274.83,
  227.07,
  234.17,
  36,
  26,
  26
);
triangles[190] = new tri(
  261.16,
  185.67,
  340.08,
  180.04,
  227.07,
  234.17,
  49,
  36,
  26
);
triangles[191] = new tri(261.16, 185.67, 227.07, 0, 227.07, 234.17, 8, 6, 7);
triangles[192] = new tri(261.16, 185.67, 227.07, 0, 302.53, 87.16, 14, 10, 10);
triangles[193] = new tri(340.08, 0, 227.07, 0, 302.53, 87.16, 21, 17, 18);
triangles[194] = new tri(340.08, 0, 405.12, 99.96, 302.53, 87.16, 24, 19, 17);
triangles[195] = new tri(
  261.16,
  185.67,
  405.12,
  99.96,
  302.53,
  87.16,
  34,
  29,
  23
);
triangles[196] = new tri(
  261.16,
  185.67,
  405.12,
  99.96,
  340.08,
  180.04,
  96,
  74,
  54
);
triangles[197] = new tri(
  454.76,
  191.68,
  405.12,
  99.96,
  340.08,
  180.04,
  144,
  111,
  82
);
triangles[198] = new tri(
  454.76,
  191.68,
  405.12,
  99.96,
  534.7,
  89.83,
  145,
  112,
  84
);
triangles[199] = new tri(
  454.76,
  191.68,
  543.05,
  260.02,
  534.7,
  89.83,
  142,
  108,
  83
);
triangles[200] = new tri(
  581.73,
  128.83,
  542.09,
  232.63,
  534.7,
  89.83,
  64,
  51,
  38
);
triangles[201] = new tri(581.73, 128.83, 590.59, 0, 534.7, 89.83, 40, 29, 24);
triangles[202] = new tri(489.46, 0, 590.59, 0, 534.7, 89.83, 30, 23, 19);
triangles[203] = new tri(489.46, 0, 491.42, 51.84, 534.7, 89.83, 42, 30, 25);
triangles[204] = new tri(
  405.12,
  99.96,
  491.42,
  51.84,
  534.7,
  89.83,
  85,
  67,
  51
);
triangles[205] = new tri(405.12, 99.96, 491.42, 51.84, 489.46, 0, 34, 26, 23);
triangles[206] = new tri(405.12, 99.96, 340.08, 0, 489.46, 0, 28, 21, 19);

