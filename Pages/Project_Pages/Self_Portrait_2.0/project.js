let faceMesh;
let face;

let handPose;
let hand;

let video;
let count = 0;

function preload(){
  displayBasicInformation();
  faceMesh = ml5.faceMesh();
  handPose = ml5.handPose();
}

let s = true;

function gotFaces(result){
    face = result[0];
  // if(s){
  //   console.log(face);
  //   s = false;
  // }
}

function gotHands(result){
    hand = result[0];
  if(s){
    //console.log(hand);
    s = false;
  }
}
let canvas;
function setup() {
  canvas = createCanvas(2000,1615);
  canvas.parent(document.getElementById("projectContainer"));
  noLoop();
  video = createCapture(VIDEO,{ flipped: false });
  video.size(width,height);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
    //handPose.detectStart(video, gotHands);
  pixelDensity(1);
  
   for (let i = 0; i < TRIANGULATION.length - 2; i += 3) {
     triangles.push(new Tri());
   }
  textAlign(CENTER);
  textFont(pageFont);
  
}
let xCo = 0;
let yCo = 0;
function draw() {
 // if(hand && hand.index_finger_tip){
 //   xCo = hand.index_finger_tip.x;
 //   yCo = hand.index_finger_tip.y;
 // }

  background(0);
  push()
   fill("white");
  noStroke();
  textSize(50);
   text("Move your mouse", width/2, 4*height/5);
   fill("red");
  text("Flash Warning",width/2, 7*height/8 );
  pop();
  push();
  stroke("white");
  strokeWeight(10);
  point(mouseX,mouseY);
  video.loadPixels();
 
  //flashing effects gradually accumulate as more triangles are removed
  if(face){
     
    for (let i = 0; i < TRIANGULATION.length - 2; i += 3) {
      const indexA = TRIANGULATION[i];
      const indexB = TRIANGULATION[i + 1];
      const indexC = TRIANGULATION[i + 2];
      const pointA = face.keypoints[indexA];
      const pointB = face.keypoints[indexB];
      const pointC = face.keypoints[indexC];
      
      let triCentroid = calculateTriCentroid(pointA.x,pointB.x,pointC.x,pointA.y,pointB.y,pointC.y);
      
      let r = video.pixels[calculatePixel(round(triCentroid.x),round(triCentroid.y),video.width)];
      let g = video.pixels[calculatePixel(round(triCentroid.x),round(triCentroid.y),video.width)+1];
      let b = video.pixels[calculatePixel(round(triCentroid.x),round(triCentroid.y),video.width)+2];
      
    let ratio = map(count,0,triangles.length,0.5,1);
      if(random(1)>(map(count,0,triangles.length,0.999,0.98))){
       drawQuad(2,face.box.xMin, face.box.xMax,face.box.yMin, face.box.yMax,ratio);
      }
 
 
         triangles[i/3].update(pointA.x,pointA.y,pointB.x,pointB.y,pointC.x,pointC.y,r,g,b);

    checkTriHover( triangles[i/3].x1,triangles[i/3].x2,triangles[i/3].x3,triangles[i/3].y1,triangles[i/3].y2,triangles[i/3].y3,i/3);
     
       triangles[i/3].show();

     
      
    }
  }
  pop();
  push();
  showHint(40);
  pop();
}

function calculateTriCentroid(x1,x2,x3,y1,y2,y3){
  return{x:(x1+x2+x3)/3, y:(y1+y2+y3)/3};
}

function checkTriHover(x1,x2,x3,y1,y2,y3,i){
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
      abs(checkTri-
        triArea(
          x1,
          y1,
          x2,
          y2,
          x3,
          y3
        )) < 0.02 &&
      triangles[i].alpha == 255
    ) {
      triangles[i].alpha = 0;
      count++;
    }
  if (count >= triangles.length-370) {
      for (let i = 0; i < triangles.length; i++) {
        triangles[i].alpha = 255;
      }
      count = 0;
    }
}

function drawQuad(strokeW, xmin, xmax, ymin, ymax,ratio) {
  push();
  translate((xmin+xmax)/2,(ymax+ymin)/2);
  stroke(random(0, 255), random(0, 255), random(0, 255), random(0, 255));

  strokeWeight(strokeW);
  noFill();
  
  quad(
  random(-ratio*400, ratio*400),
    random(-ratio*400, ratio*400),
       random(-ratio*400, ratio*400),
    random(-ratio*400, ratio*400),
      random(-ratio*400, ratio*400),
    random(-ratio*400, ratio*400),
     random(-ratio*400, ratio*400),
    random(-ratio*400, ratio*400)
  );
  pop();
  
}
