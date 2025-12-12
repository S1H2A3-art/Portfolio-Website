/* ============================================================
   Controls Thinker Activation
   ============================================================ */

let mouseHover = false;
let thinkerActive = false;

const thinkerImage = document.getElementsByClassName("leftTextAndImageElement")[0];
const body = document.getElementsByTagName("body")[0];

let thinkerCanvas = null;

// returns current thinkerCanvas
function getThinkerCanvas() {
    if (!thinkerCanvas) {
        thinkerCanvas = document.getElementById("thinkerCanvas");
    }
    return thinkerCanvas;
}
    
// check if mouse is hovering above thinker image
thinkerImage.addEventListener("mouseover", () => {
  mouseHover = true;

  setTimeout(() => {
    // observes opacity of body
    observer.observe(body, { attributes: true, attributeFilter: ['style'] });
    // starts fading
    startFade(-0.01); 
  }, 20000);

});

// check if mouse is not hovering above thinker image
thinkerImage.addEventListener("mouseout", () => {
    observer.disconnect();
    mouseHover = false;

    //starts appearing
    if(!thinkerActive) startFade(0.01);
});

 // observes opacity of body
const observer = new MutationObserver(() => {
  const bodyOpacity = parseFloat(getComputedStyle(body).opacity);

  // if body completely disappears
  if(bodyOpacity === 0){

    // activate thinker
    thinkerActive = true;
    thinkerActivate();   
  }
  
});

function thinkerActivate(){
     // remove all other DOM
    body.style.transition = "opacity 10s ease";
    AIAssistant = null;
    document.getElementById("mainDisplay").innerHTML = null;
    document.getElementById("menuBar").innerHTML = null;
    document.getElementsByClassName("menuButton")[0].innerHTML = null;
    document.getElementById("AIContainer").innerHTML = null;
    document.getElementById("AIContainer").style.display = "none";
    document.getElementById("recommendationContainer").innerHTML = null;

    // Show only Thinker elements
    document.getElementById("inputContainer").style.opacity = 1;
    document.getElementById("inputContainer").style.display = "flex";

    document.getElementById("thinkerMessageContainer").style.opacity = 0.5;
    document.getElementById("thinkerMessageContainer").style.display = "block";

    getThinkerCanvas().style.opacity = 1;
    getThinkerCanvas().style.display = "block";

    // make body reappear
    body.style.opacity = 1;
}

// fade/appear animation
let fadeTimer;
function startFade(step) {
  clearInterval(fadeTimer);

  // if hover state and transition don't match, break
  if(mouseHover && step > 0 && !thinkerActive) return;
  if(!mouseHover && step < 0 && !thinkerActive) return;

    fadeTimer = setInterval(() => {
        const current = parseFloat(body.style.opacity) || 1;
        const next = Math.max(0, Math.min(1, current + step));
        body.style.opacity = next;
        if ((step < 0 && next <= 0) || (step > 0 && next >= 1) || (step < 0 && !mouseHover)) {
        clearInterval(fadeTimer);
        }
    }, 50);

}
