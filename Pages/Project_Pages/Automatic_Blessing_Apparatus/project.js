let blessings = [
  "The Lord bless you and keep you;\n the Lord make his face shine upon you and be gracious to you;\n the Lord lift up his countenance upon you and give you peace.",
  "For I know the plans I have for you,\n declares the Lord,\n plans to prosper you and not to harm you,\n plans to give you hope and a future.",
  "And my God will meet all your needs\n according to the riches of his glory in Christ Jesus.",
  "The land yields its harvest;\n God, our God, blesses us.",
  "Every good gift and every perfect gift is from above,\n coming down from the Father of lights.",
  "Blessed are all who fear the Lord,\n who walk in obedience to him.\n You will eat the fruit of your labor;\n blessings and prosperity will be yours.",
  "So do not fear, for I am with you;\n do not be dismayed, for I am your God.\n I will strengthen you and help you;\n I will uphold you with my righteous right hand.",
];

let music;
let audio;
let wasPlaying = false;
let wasBlessed = false;
let img1;
let images = [];
let classifier;
let confidence;

let predictedSound = "";

let modelJson = "https://teachablemachine.withgoogle.com/models/jfPNa-YWG/";

function preload() {
  displayBasicInformation();
  music = loadSound("Assets/music.mp3");
  img1 = loadImage("Assets/statue.jpg");
  images.push(loadImage("Assets/cool_jesus.jpg"));
  images.push(loadImage("Assets/thumbsup.gif"));
  images.push(loadImage("Assets/smile.jpeg"));
  images.push(loadImage("Assets/sunglasses.jpg"));
  classifier = ml5.soundClassifier(modelJson);
}
let canvas;
function setup() {
  canvas = createCanvas(1200, 1200);
  canvas.parent(document.getElementById("projectContainer"));
  noLoop();
  textAlign(CENTER, CENTER);
  textSize(50);

  classifier.classifyStart(gotResult);

}

let active = false;
let textSpoken;
let randImage;
function bless() {
  if (!active) {
    music.setVolume(0.3);
    music.play();

    textSpoken = int(random(0, blessings.length));
    randImage = int(random(0, images.length));
    generateSpeech(blessings[textSpoken]);

    active = true;
  }
}

function draw() {
  image(img1, 0, 0, width, height);
  //print(predictedSound);
  //print(confidence);

  if (
    predictedSound == "bless" &&
    confidence > 0.96 &&
    !wasBlessed &&
    !music.isPlaying()
  ) {
    bless();
    wasBlessed = true;
  } else if (predictedSound != "bless" && wasBlessed) {
    wasBlessed = false;
  }

  if (audio && audio.isPlaying() && !wasPlaying) {
    wasPlaying = true;
  } else if (audio && !audio.isPlaying() && wasPlaying) {
    fadeOutAndPause(music);
    active = false;
    wasPlaying = false;
  }

  if (music.isPlaying()) {
    push();
    tint(255, music.getVolume() * 3.3333 * 255);
    image(images[randImage], 0, 0, width, height);
    fill(255, 255, 255, music.getVolume() * 3.3333 * 255);
    stroke(0, 0, 0, music.getVolume() * 3.3333 * 255);
    strokeWeight(1);
    text(blessings[textSpoken], width / 2, height / 2);
    pop();
  }
  showHint(40,true,"Press to start");
  if(frameCount >= 2)
  loop();


 
}
function gotResult(results) {
  predictedSound = results[0].label;
  confidence = results[0].confidence;
}

function fadeOutAndPause(sound, duration = 5) {
  sound.setVolume(0, duration);

  setTimeout(() => {
    sound.pause();
  }, duration * 1000);
}