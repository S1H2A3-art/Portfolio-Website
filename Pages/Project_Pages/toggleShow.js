let showState = false;
let showMode = "mouse";

function getToggleKey(){
    if(!showMode || showMode === "mouse"){
        return null;
    }
    if(showMode === "key"){
        return "c";
    }
    return String(showMode).trim().toLowerCase();
}



function mousePressed(){
    if(showMode === "mouse"){
        if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
            if(showState){
                noLoop();
                showState = false;
            }else{
                loop();
                showState = true;
            }
            
        }
    }
}

function keyPressedShow() {
    const toggleKey = getToggleKey();
    if(!toggleKey){
        return;
    }
    if (key.toLowerCase() === toggleKey) {
   if(showState){
        noLoop();
        showState = false;
    }else{
        loop();
        showState = true;
    }
        
}
}

let previousState = false;
function showHint(size,noRepeat,hintInstruction) {

    if(noRepeat && previousState)return;

    previousState = true;

    const projectContainer = document.getElementById("projectContainer");
    if (!projectContainer)return;

    const instructions = document.getElementById("instructions");
    const controlInstruction = instructions ? instructions.closest("control-instruction") : document.querySelector("control-instruction");
    const instructionsAttribute = controlInstruction?.getAttribute("instructions") || "";
    const trimmedAttribute = instructionsAttribute.trim();
    const lowerCaseAttribute = trimmedAttribute.toLowerCase();
    const toggleKey = getToggleKey();

    if (controlInstruction) {
        controlInstruction.style.display = lowerCaseAttribute === "hide" ? "none" : "";
    }

    if (instructions && instructions.dataset.initial === undefined) {
        instructions.dataset.initial = instructions.innerHTML;
    }

    const hintMarkup = toggleKey ? `<p id = "defaultInstruction" style="display:inline; font-weight:500">START/PAUSE:</p> <p style="display:inline; color:#666666;">&ensp;press key ${toggleKey.toUpperCase()}</p>` : "";
    const shouldShowHint = Boolean(toggleKey);

    const getDesiredInstructionsHTML = () => {
        if (!instructions) {
            return null;
        }
        if (lowerCaseAttribute === "hide") {
            return "";
        }
        if (trimmedAttribute === "") {
            return shouldShowHint ? hintMarkup : "";
        }
        const base = instructions.dataset.initial || "";
        return shouldShowHint ? `${base}${hintMarkup}` : base;
    };

    const desiredInstructionsHTML = getDesiredInstructionsHTML();

    if (shouldShowHint && (webglVersion === WEBGL || webglVersion === WEBGL2)) {
        projectContainer.style.pointerEvents = showState ? "auto" : "none";
        if (instructions && desiredInstructionsHTML !== null && instructions.innerHTML !== desiredInstructionsHTML) {
            instructions.innerHTML = desiredInstructionsHTML;
        }
    } else if (!showState) {
        if (instructions && desiredInstructionsHTML !== null && instructions.innerHTML !== desiredInstructionsHTML) {
            instructions.innerHTML = desiredInstructionsHTML;
        }
        projectContainer.style.pointerEvents = "auto";
        if(showMode === "mouse" && size){
        document.getElementById("projectContainer").style.cursor = "pointer";
        push();
        textFont(pageFont);
        textAlign(CENTER, CENTER);
        fill(0, 0, 0, 100);
        rect(0, 0, width, height);
        fill(255);
        textSize(size);
        if(hintInstruction){
            text(hintInstruction, width / 2, height / 2);
        }else{
        text("Press to start/pause the code", width / 2, height / 2);
        }
        pop();
        }
    }
    
}
