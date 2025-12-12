let askBtn;
let inputField;

let background1;
let background2;
let background3;
let ambientLoopStarted = false;

let creatorBackground;
let creatorImage = [];

let orderBackground;
let orderImage = [];

let chaosBackground;
let chaosImage = [];

let freedomBackground;
let freedomImage = [];

let music;
function preload() {
  showMode = "*";
  displayBasicInformation();
  creatorImage.push(loadImage("Assets/creator_1.jpeg"));
  creatorImage.push(loadImage("Assets/creator_2.jpeg"));
  creatorImage.push(loadImage("Assets/creator_3.jpeg"));
  creatorImage.push(loadImage("Assets/creator_4.jpeg"));

  orderImage.push(loadImage("Assets/order_1.png"));
  orderImage.push(loadImage("Assets/order_2.png"));
  orderImage.push(loadImage("Assets/order_3.png"));
  orderImage.push(loadImage("Assets/order_4.png"));
 
  chaosImage.push(loadImage("Assets/chaos1.png"));
  chaosImage.push(loadImage("Assets/chaos2.png"));
  chaosImage.push(loadImage("Assets/chaos3.png"));
  chaosImage.push(loadImage("Assets/chaos4.png"));

  freedomImage.push(loadImage("Assets/freedom1.png"));
  freedomImage.push(loadImage("Assets/freedom2.png"));
  freedomImage.push(loadImage("Assets/freedom3.png"));
  freedomImage.push(loadImage("Assets/freedom4.png"));
  freedomImage.push(loadImage("Assets/freedom5.png"));
  freedomImage.push(loadImage("Assets/freedom6.png"));
  
  music = loadSound("Assets/music.mp3");
  music.setVolume(0.2);
  
}

let categories = [
  { category: "Existence", insights: [] },
  { category: "Selfhood", insights: [] },
  { category: "Knowledge", insights: [] },
  { category: "Politics, ethics, and history", insights: [] },
  { category: "Meaning", insights: [] },
  { category: "Freedom", insights: [] },
];

let canvas;
let introSpeechStarted = false;
let introStartListenersBound = false;
function setup() {
  
  canvas = createCanvas(2000, 1333);
  canvas.parent(document.getElementById("projectContainer"));
  textFont(pageFont);

  const container = document.getElementById("projectContainer");
  container.style.position = "relative";

  const controls = document.getElementById("controls");
  controls.style.position = "absolute";
  controls.style.top = "50%";
  controls.style.left = "50%";
  controls.style.transform = "translate(-50%, -50%)";
  controls.style.display = "flex";
  controls.style.flexDirection = "column";
  controls.style.alignItems = "center";
  controls.style.justifyContent = "center";
  controls.style.gap = "1.5rem";
  controls.style.width = "auto";

  inputField = createInput("Let there be (insert concept)!");
  inputField.style("font-size", "2rem");
  inputField.style("width", "45rem");
  inputField.style("text-align", "center");
  inputField.style("display", "none");
  askBtn = createButton("Enter");
  askBtn.mousePressed(ask);
  askBtn.style("font-size", "2rem");
  askBtn.style("width", "10rem");
  askBtn.style("display", "none");
  inputField.parent(controls);
  askBtn.parent(controls);
  

  background1 = createVideo('Assets/background1.mp4');
  background2 = createVideo('Assets/background2.mp4');
  background3 = createVideo('Assets/background3.mp4');
  creatorBackground = createVideo('Assets/creator_background.mp4');
  creatorBackground.hide(); 
  orderBackground = createVideo('Assets/order_background.mp4');
  orderBackground.hide(); 
  chaosBackground = createVideo('Assets/chaos_background.mp4');
  chaosBackground.hide(); 
  freedomBackground = createVideo('Assets/freedom_background.mp4');
  freedomBackground.hide(); 
  background1.hide(); 
  background2.hide(); 
  background3.hide(); 
  noLoop();
}

function startIntroSpeech(){
  if(introSpeechStarted){
    return;
  }

  const launchSpeech = () => {
    if(introSpeechStarted){
      return;
    }
    introSpeechStarted = true;
    generateSpeech("I am the Creator, and this is the game of beginnings. The world does not yet exist—it waits for your words. To shape it, you must speak the command “Let there be [insert notion]”, calling a new idea into the void. Each notion will then be defined through debate, and I shall choose the meaning that brings balance to creation. When at least one notion has been chosen for each of the six pillars—Existence, Selfhood, Knowledge, Ethics, Meaning, and Freedom—the universe will be complete, and I shall speak the final words: “Let there be the World.” Now, the void is listening; what will you bring into being?", creatorVoice[0][0], () => {
      inputField.style("display", "block");
      askBtn.style("display", "block");
    }, creatorVoice[0][1]);
  };

  const audioContext = getAudioContext();
  const tryStart = () => {
    audioContext.resume().finally(launchSpeech);
  };

  if(audioContext.state === "running"){
    launchSpeech();
  }else{
    if(!introStartListenersBound){
      introStartListenersBound = true;
      const kickoff = () => {
        userStartAudio();
        tryStart();
        window.removeEventListener("pointerdown", kickoff);
        window.removeEventListener("keydown", kickoff);
      };
      window.addEventListener("pointerdown", kickoff, { once: true });
      window.addEventListener("keydown", kickoff, { once: true });
    }
  }
  
}

let inputWarning;
let speeches;
let currentSpeaking = 0;
let judgeSpeech;
let isSpeechLoading = false;
let pendingJudgePlayback = false;
let worldConclusionNarrated = false;

function ask() {
  if (inputWarning) inputWarning.remove();
  let words = inputField.value().split(" ");
  if (
    words[0].toLowerCase() === "let" &&
    words[1].toLowerCase() === "there" &&
    words[2].toLowerCase() === "be" &&
    words.length === 4
  ) {
    resetSpeechPlayback();
    
    askAI("what is" + words[3]);
    inputField.style("display", "none");
    askBtn.style("display", "none");
  } else {
    inputWarning = createP(
      "invalid input, please ask the question in the format of: what is (insert concept)"
    );
  }
}
function keyPressed(){
  keyPressedShow();
  
}
function resetSpeechPlayback() {
  if (audio) {
    audio.stop();
  }
  speeches = undefined;
  judgeSpeech = undefined;
  currentSpeaking = 0;
  pendingJudgePlayback = false;
  isSpeechLoading = false;
  worldConclusionNarrated = false;
  if(typeof worldConclusion !== "undefined"){
    worldConclusion = "";
  }
  createWorld = false;
}
let createWorld = false;
let randImage = 0;
function draw() {
  textAlign(CENTER,CENTER);
  textSize(100);
  //console.log(frameCount);
  if(!ambientLoopStarted && frameCount >= 2){
    startIntroSpeech();
    if(background1) background1.loop(); 
    if(background2) background2.loop();
    if(background3) background3.loop(); 
    if(music && !music.isPlaying()){
      music.loop();
    }
    ambientLoopStarted = true;
  }
  
  background(0);
  
  if(createWorld){
    background(0);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    const hasConclusion = typeof worldConclusion !== "undefined" && worldConclusion.length;
    if(hasConclusion && !worldConclusionNarrated){
      worldConclusionNarrated = true;
      generateSpeech("Let there be the world" + worldConclusion, creatorVoice[0][0], null, creatorVoice[0][1]);
    }
    const conclusionText = hasConclusion ? worldConclusion : "The cosmos settles into silence...";
    const lines = conclusionText.split("\n").filter(line => line.trim().length);
    let startY = height / 2 - (lines.length * 24);
    for(const line of lines){
      text(line, width/2, startY);
      startY += 60;
    }
    return;
  }else if(currentSpeaking == 3 && judgeSpeaking && audio.isPlaying()){
    creatorBackground.loop(); 
    image(creatorBackground, 0, 0,2000, 1333);
    push();
    
    tint(255, 150);
    if(randImage < creatorImage.length){
      image(creatorImage[randImage], 0, 0,2000, 1333);
    }else{
      image(creatorImage[0], 0, 0,2000, 1333);
    }
    if(random(1) > 0.97){
      randImage = parseInt(creatorImage.length * random())
    }
    fill(255,255,255,150);
    text("CREATOR", width/2, height-100);
    pop();
    
  }else if(currentSpeaking == 0 && audio && audio.isPlaying()){
    creatorBackground.loop(); 
    image(creatorBackground, 0, 0,2000, 1333);
    push();
    
    tint(255, 150);
    if(randImage < creatorImage.length){
      image(creatorImage[randImage], 0, 0,2000, 1333);
    }else{
      image(creatorImage[0], 0, 0,2000, 1333);
    }
    if(random(1) > 0.97){
      randImage = parseInt(creatorImage.length * random())
    }
    fill(255,255,255,150);
    text("CREATOR", width/2, height-100);
    pop();
  }
  else if(currentSpeaking == 1 && audio.isPlaying()){
    orderBackground.loop(); 
    image(orderBackground, 0, 0,2000, 1333);
    push();
    
    tint(255, 150);
    if(randImage < orderImage.length){
      image(orderImage[randImage], 0, 0,2000, 1333);
    }else{
      image(orderImage[0], 0, 0,2000, 1333);
    }
    if(random(1) > 0.9){
      randImage = parseInt(orderImage.length * random())
    }
    fill(255,255,255,150);
    text("ORDER", width/2, height-100);
    pop();
   
  }else if(currentSpeaking == 2 && audio.isPlaying()){
    chaosBackground.loop(); 
    image(chaosBackground, 0, 0,2000, 1333);
    push();
    
    tint(255, 90);
    if(randImage < chaosImage.length){
      image(chaosImage[randImage], 0, 0,2000, 1333);
    }else{
      image(chaosImage[0], 0, 0,2000, 1333);
    }
    if(random(1) > 0.85){
      randImage = parseInt(chaosImage.length * random())
    }
    fill(255,255,255,150);
    text("CHAOS", width/2, height-100);
    pop();
  }else if(currentSpeaking == 3 && audio.isPlaying()){
     freedomBackground.loop(); 
    image(freedomBackground, 0, 0,2000, 1333);
    push();
    
    tint(255, 120);
    if(randImage < freedomImage.length){
      image(freedomImage[randImage], 0, 0,2000, 1333);
    }else{
      image(freedomImage[0], 0, 0,2000, 1333);
    }
    if(random(1) > 0.75){
      randImage = parseInt(freedomImage.length * random())
    }
    fill(255,255,255,150);
    text("FREEDOM", width/2, height-100);
    pop();
  }else{
    push();
    tint(255, 220);
    image(background1, 0, 0,2000, 1333);

    tint(255, 50);
    image(background2, 0, 0,2000, 1333);

    tint(255, 50);
    image(background3, 0, 0,2000, 1333);
    pop();
  }
  //if(audio)console.log(currentSpeaking + "    " + audio.isPlaying() + "    " + judgeSpeaking);
  showHint();

  //no pause
  if(frameCount >= 2)
  loop();

  if(document.getElementById("defaultInstruction"))
  document.getElementById("defaultInstruction").innerHTML = `START PLAY(Cannot pause):`;
  
}

function startSpeechPlayback(queue) {
  speeches = queue;
  currentSpeaking = 0;
  pendingJudgePlayback = false;
  playNextSpeech();
}

function playNextSpeech() {
  if (!speeches || isSpeechLoading) {
    return;
  }

  if (currentSpeaking >= speeches.length) {
    if (judgeSpeech && judgeSpeech[1]) {
      playJudgeSpeech();
    } else {
      pendingJudgePlayback = true;
    }
    return;
  }

  let voiceIndex = Math.min(currentSpeaking, voices.length - 1);
  let text = speeches[currentSpeaking];
  currentSpeaking++;
  isSpeechLoading = true;

  generateSpeech(text, voices[voiceIndex][0], () => {
    isSpeechLoading = false;
    playNextSpeech();
  },voices[voiceIndex][1]);
}
let judgeSpeaking = false;
function playJudgeSpeech() {
  if (isSpeechLoading || !judgeSpeech || !judgeSpeech[1]) {
    return;
  }

  const voiceIndex = Math.min(currentSpeaking, voices.length - 1);
  isSpeechLoading = true;
  judgeSpeaking = true;

  generateSpeech(judgeSpeech[2], creatorVoice[0][0], () => {
    isSpeechLoading = false;
    speeches = undefined;
    pendingJudgePlayback = false;
    currentSpeaking = 0;
    judgeSpeaking = false;
    inputField.style("display", "block");
    askBtn.style("display", "block");
    let categorySatisfied = 0;
    for(let category of categories){
        if(category.insights.length > 0){
            categorySatisfied++;
        }
    }
    if(categorySatisfied === categories.length){
        createWorld = true;
        fetchWorldConclusion();
    }
  }, creatorVoice[0][1]);
}
