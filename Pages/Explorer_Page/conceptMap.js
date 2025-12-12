let font1;
let font2;

//determines which concept to focus
let lockMode = -1;

function preload(){
  font1 = loadFont("../../Assets/Manrope_Font_Family_(Fontmirror)/Manrope3 Regular 400.otf");
  font2 = loadFont("../../Assets/Manrope_Font_Family_(Fontmirror)/Manrope3 Bold 700.otf");
  projectInformation = loadJSON("../../Projects/projectInformation.json", processProjectsInformation);
  
}

//Determines the user's last input that caused an error
let previousAlert = false;

//if new input is different from last erroneous input, get rid of the alert
function updateAlert(){
  if(previousAlert && previousAlert != document.getElementById("searchConcept").value){
    document.getElementById("searchAlert").style.display = "none";
    previousAlert = false;
  }
}

//read text field input and select concept based on user's input
function conceptFinder(){
  let userInput = document.getElementById("searchConcept").value;
  if(userInput !== undefined){
    for(let i = 0; i < concepts.length; i++){
      if(concepts[i].name == userInput){
        lockMode = i;

        //->suggestedSearch.js
        suggestConcepts();

        //close menu once a concept is selected
        if(state){
          toggleMenu();
        }

        //apply wiggle to selected concept
        let acc = p5.Vector.random3D().setMag(5);
        concepts[lockMode].velocity.add(acc);
        return; 
    }
  }

  //show alert message if input is erroneous
  document.getElementById("searchAlert").style.display = "block";
  previousAlert = userInput;
  }
}

//reset camera position and other settings that the reset button changes
function resetCamera(){ 
  lockMode = -1;
  camera(
    0,               // camX
    0,               // camY
    400, // camZ
    0,               // centerX
    0,               // centerY
    0,               // centerZ
    0,               // upX
    1,               // upY
    0                // upZ
  );

  //reset "Enter concept" message
  let inputElement = document.getElementById("searchConcept");
  inputElement.value = "Enter concept";

  //->suggestedSearch.js
  suggestConcepts();
}

//apply attraction/repulsion forces to each other(concepts) based on relatedness
function applyForces() {
  let k = 0.01; // spring constant
  let repel = 4000; // repulsion constant
  let damping = 0.5;

  for (let i = 0; i < conceptsNum; i++) {
    for (let j = i + 1; j < conceptsNum; j++) {
      let c1 = concepts[i];
      let c2 = concepts[j];

      // Vector between them
      let dx = c2.position.x - c1.position.x;
      let dy = c2.position.y - c1.position.y;
      let dz = c2.position.z - c1.position.z;
      let distSq = dx * dx + dy * dy + dz * dz + 0.1;
      let dist = sqrt(distSq);

      // Attractive force based on relatedness
      let targetDist = 0;
      if(relatedness[i][j]){
        targetDist = map(relatedness[i][j],0,maxRelation, 200, 50);
      }else{
        targetDist = 200;
      }
      let spring = k * (dist - targetDist);

      // Repulsive force
      let repulsion = repel / distSq;

      // Net force
      let f = spring - repulsion;

      // Apply force 
      let fx = (dx / dist) * f;
      let fy = (dy / dist) * f;
      let fz = (dz / dist) * f;

      c1.velocity.x += fx;
      c1.velocity.y += fy;
      c1.velocity.z += fz;
      c2.velocity.x -= fx;
      c2.velocity.y -= fy;
      c2.velocity.z -= fz;
    }
  }

  // Update positions with damping
  for (let c of concepts) {
    c.position.x += c.velocity.x;
    c.position.y += c.velocity.y;
    c.position.z += c.velocity.z;

    c.velocity.x *= damping;
    c.velocity.y *= damping;
    c.velocity.z *= damping;
  }
}

function setup() {

  //showConceptsInformation();
  //console.log(projects)
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(font1); 

  // ->suggestedSearch.js
  suggestConcepts();

  //initialize orbit control default settings
  cam = createCamera();
  cam.setPosition(0, 0, 300);
  cam.lookAt(0, 0, 0);

  let params = new URLSearchParams(window.location.search);
  let concept = params.get("concept");
  
  if (concept) {
    document.getElementById("searchConcept").value = concept;
    conceptFinder();
  }
}

let showProjectsState = -1;

function draw() {
  background(255);
 
  //change WEBGL camera settings so closer objects can be seen
  let gl = this._renderer.GL; 
  let fov = PI / 3;
  let aspect = width / height;
  let near = 0.01; 
  let far = 2000;
  perspective(fov, aspect, near, far);

  //->suggestedSearch.js
  searchAssist();

  updateAlert();

  //calculates position of concepts based on relatedness
  applyForces();

  // Draw connections
  for (let i = 0; i < conceptsNum; i++) {
    for (let j = i + 1; j < conceptsNum; j++) {
      if(relatedness[i][j]){
        let r = relatedness[i][j];
        // Draw only meaningful relations
        if (r > 0.2) { 
          push();
          strokeWeight(0.1);
          stroke(0, 0, 0, r * 100);
          line(
            concepts[i].position.x, concepts[i].position.y, concepts[i].position.z,
            concepts[j].position.x, concepts[j].position.y, concepts[j].position.z
          );
          pop();
        }
      }
    }
  }


  for (let c of concepts) {
    push();
    translate(c.position.x , c.position.y, c.position.z);

    // Draw point
    // stroke(255, 0, map(c.position.x+c.position.y+c.position.z, 0, 200,0,150), map(c.relations, 1, maxRelation, 20, 255));
    // strokeWeight((c.relations / maxRelation) * 30 * (c.relations / maxRelation) + 10);
    // point(0, 0, 0);
    noStroke();
    fill(255, 0, map(c.position.x+c.position.y+c.position.z, 0, 200,0,150));
    sphere((c.relations / maxRelation) * 6 * (c.relations / maxRelation) + 1, 20);

    // Make text face camera & draw text
    push();
    gl.disable(gl.DEPTH_TEST);
    faceCamera(c.position.x, c.position.y, c.position.z, cam);
    textAlign(CENTER, CENTER);
    //fill(0, 0, 0, map(c.relations, 1, maxRelation, 50, 255));
    fill(0,0,0);
    textSize(map(c.relations, 1, maxRelation, 1, 6));
    translate(0, map(c.relations, 1, maxRelation, 1, 9), 0);

    //if concept is selected, make it red
    if(lockMode == concepts.findIndex(obj => obj.name === c.name)){
      fill(55,0,0);
    }

    text(c.name, 0, 0);

    pop();

    gl.enable(gl.DEPTH_TEST);

    pop();

  }
  
  //adjust camera based on sizes of concepts
  if(lockMode >= 0){
    camera(concepts[lockMode].position.x,concepts[lockMode].position.y,concepts[lockMode].position.z+map(concepts[lockMode].relations,1,maxRelation,50,150),concepts[lockMode].position.x,concepts[lockMode].position.y,concepts[lockMode].position.z);   
    
    if(showProjectsState != lockMode){
      //->showProjects.js
      showProjects();
      showProjectsState = lockMode;
    }
  }else{
    document.getElementById("projectsInformation").innerHTML = "";
    showProjectsState = -1;
  }
  orbitControl();

  
  
}


