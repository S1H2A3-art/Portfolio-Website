async function preload1() {
    await displayBasicInformation();
    let simulationControl = createDiv();
    simulationControl.parent("ledBoardSimulation");
    simulationControl.id("simulationControl");

    let colorControl = createDiv();
    colorControl.parent("simulationControl");
    colorControl.id("colorControl");
    colorControl.style("display", "flex");
    colorControl.style("align-items", "center");

    let colorControlTitle = createElement("p", "change the color of the light:");
    colorControlTitle.style("margin-right", "1.5rem");
    colorControlTitle.parent("colorControl");

    colorPicker = createInput();
    colorPicker.attribute("type", "color");
    colorPicker.parent("colorControl");
    colorPicker.style("width", "50px");
    colorPicker.style("height", "50px");
    colorPicker.input(processColorInput);

    let warmthControl = createDiv();
    warmthControl.parent("simulationControl");
    warmthControl.id("warmthControl");
    warmthControl.style("display", "flex");
    warmthControl.style("flex-direction", "column");

    let warmthControlLabel = createElement("p", "change the warmth of the light(warm to cool):");
    warmthControlLabel.style("margin-right", "1.5rem");
    warmthControlLabel.parent("warmthControl");
    warmthControlSlider = createSlider(0, 100, 50, 1);
    warmthControlSlider.parent("warmthControl");
    warmthControlSlider.style("width", "30rem");

    let brightnessControl = createDiv();
    brightnessControl.parent("simulationControl");
    brightnessControl.id("brightnessControl");
    brightnessControl.style("display", "flex");
    brightnessControl.style("flex-direction", "column");

    let brightnessControlLabel = createElement("p", "change the brightness of the light(low to high):");
    brightnessControlLabel.parent("brightnessControl");
    brightnessControlSlider = createSlider(0, 100, 50, 1);
    brightnessControlSlider.parent("brightnessControl");
    brightnessControlSlider.style("width", "30rem");

    brightnessControlSlider.input(() => processColorInput("brightnessControlSlider"));
    warmthControlSlider.input(() => processColorInput("warmthControlSlider"));
    colorPicker.input(() => processColorInput("colorPicker"));

    let colorChangeSpeedControl = createDiv();
    colorChangeSpeedControl.parent("simulationControl");
    colorChangeSpeedControl.id("colorChangeSpeedControl");
    colorChangeSpeedControl.style("display", "flex");
    colorChangeSpeedControl.style("flex-direction", "column");

    let colorChangeSpeedControlTitle = createElement("p", "change the speed of the color change(low to high):");
    colorChangeSpeedControlTitle.parent("colorChangeSpeedControl");

    let colorChangeSpeedSlider = createSlider(0.1, 0.7, 0.7, 0.01);
    colorChangeSpeedSlider.parent("colorChangeSpeedControl");
    colorChangeSpeedSlider.style("width", "30rem");
    colorChangeSpeedSlider.input(() => {
        colorChangeSpeed = colorChangeSpeedSlider.value();
    }
    );


    let patternControl = createDiv();
    patternControl.parent("simulationControl");
    patternControl.id("patternControl");
    patternControl.style("display", "flex");

    patternControl.style("flex-direction", "column");

    let patternControlTitle = createElement("p", "choose the pattern:");
    patternControlTitle.style("margin-right", "1.5rem");
    patternControlTitle.parent("patternControl");

    let patternPicker = createDiv();
    patternPicker.id("patternPicker");
    patternPicker.parent("patternControl");
    patternPicker.style("display", "flex");
    patternPicker.style("gap", "1.5rem");


    let patternDiag = createDiv();
    patternDiag.id("patternDiag");
    patternDiag.parent("patternPicker");
    patternDiag.style("display", "flex");
    patternDiag.style("align-items", "center");
    patternDiag.style("justify-content", "center");


    patternDiagPicker = createCheckbox("", false);
    patternDiagPicker.id("patternDiagPicker");
    patternDiagPicker.style("transform-origin", "center");
    patternDiagPicker.style("transform", "scale(3)");
    patternDiagPicker.changed(() => {
        if (patternDiagPicker.checked()) {
            pattern.push("diag");
        } else {
            pattern = pattern.filter(p => p !== "diag");
        }
    });


    patternDiagPicker.style("margin-right", "1.5rem");

    patternDiagPicker.parent("patternDiag");

    let patternDiagPickerLabel = createElement("label", "diag");
    patternDiagPickerLabel.parent("patternDiag");
    patternDiagPickerLabel.style("margin-right", "1.5rem");
    patternDiagPickerLabel.style("fontSize", "2rem");


    let patternCross = createDiv();
    patternCross.id("patternCross");
    patternCross.parent("patternPicker");
    patternCross.style("display", "flex");
    patternCross.style("align-items", "center");
    patternCross.style("justify-content", "center");



    patternCrossPicker = createCheckbox("", true);
    patternCrossPicker.id("patternCrossPicker");
    patternCrossPicker.style("transform-origin", "center");
    patternCrossPicker.style("transform", "scale(3)");
    patternCrossPicker.changed(() => {
        if (patternCrossPicker.checked()) {
            pattern.push("cross");
        } else {
            pattern = pattern.filter(p => p !== "cross");
        }
    });


    patternCrossPicker.style("margin-right", "1.5rem");
    patternCrossPicker.parent("patternCross");

    let patternCrossPickerLabel = createElement("label", "cross");
    patternCrossPickerLabel.parent("patternCross");
    patternCrossPickerLabel.style("margin-right", "1.5rem");
    patternCrossPickerLabel.style("fontSize", "2rem");

    let patternSurround = createDiv();
    patternSurround.id("patternSurround");
    patternSurround.parent("patternPicker");
    patternSurround.style("display", "flex");
    patternSurround.style("align-items", "center");
    patternSurround.style("justify-content", "center");


    patternSurroundPicker = createCheckbox("", false);
    patternSurroundPicker.id("patternSurroundPicker");
    patternSurroundPicker.style("transform-origin", "center");
    patternSurroundPicker.style("transform", "scale(3)");
    patternSurroundPicker.changed(() => {
        if (patternSurroundPicker.checked()) {
            pattern.push("surround");
        } else {
            pattern = pattern.filter(p => p !== "surround");
        }
    });


    patternSurroundPicker.style("margin-right", "1.5rem");
    patternSurroundPicker.parent("patternSurround");

    let patternSurroundPickerLabel = createElement("label", "surround");
    patternSurroundPickerLabel.parent("patternSurround");
    patternSurroundPickerLabel.style("margin-right", "1.5rem");
    patternSurroundPickerLabel.style("fontSize", "2rem");

    let randomTurnOnControl = createDiv();
    randomTurnOnControl.parent("simulationControl");
    randomTurnOnControl.id("randomTurnOnControl");
    randomTurnOnControl.style("display", "flex");
    randomTurnOnControl.style("flex-direction", "column");

    let randomTurnOnControlTitle = createElement("p", "frequency of random turn on(random to stable):");
    randomTurnOnControlTitle.style("margin-right", "1.5rem");
    randomTurnOnControlTitle.parent("randomTurnOnControl");

    let randomTurnOnPicker = createSlider(0.3, 1, 0.3, 0.01);
    randomTurnOnPicker.parent("randomTurnOnControl");
    randomTurnOnPicker.style("width", "30rem");
    randomTurnOnPicker.input(() => {
        randomness = randomTurnOnPicker.value();
    });

    let colorSpreadNoiseControl = createDiv();
    colorSpreadNoiseControl.parent("simulationControl");
    colorSpreadNoiseControl.id("colorSpreadNoiseControl");
    colorSpreadNoiseControl.style("display", "flex");
    colorSpreadNoiseControl.style("flex-direction", "column");

    let colorSpreadNoiseControlTitle = createElement("p", "color spread noise(low to high):");
    colorSpreadNoiseControlTitle.style("margin-right", "1.5rem");
    colorSpreadNoiseControlTitle.parent("colorSpreadNoiseControl");

    let colorSpreadNoiseSlider = createSlider(0, 20, 0, 1);
    colorSpreadNoiseSlider.parent("colorSpreadNoiseControl");
    colorSpreadNoiseSlider.style("width", "30rem");
    colorSpreadNoiseSlider.input(() => {
        noise = colorSpreadNoiseSlider.value();
    });




}

class led {
    constructor(x, y) {
        this.ledColor = [0, 0, 0];
        this.targetColor = [0, 0, 0];
        this.status = true;
        this.size = width / 16 - 0.1;

        if (y % 2 == 0) {
            this.id = x + y * 16;
        } else {
            this.id = 15 - x + 16 * y;
        }

        ledSequence[this.id] = this;
        this.position = [x, y];
        this.duration = -1;
    }

    turnOn() {
        this.status = true;
    }

    turnOff() {
        this.status = false;
        this.duration = -1;
    }

    setColor(h, s, b) {
        this.ledColor[0] = wrapHue(h);
        this.ledColor[1] = clamp(s, 0, S_MAX);
        this.ledColor[2] = clamp(b, 0, B_MAX);
    }

    setTargetColor(h, s, b) {
        this.targetColor[0] = wrapHue(h);
        this.targetColor[1] = clamp(s, 0, S_MAX);
        this.targetColor[2] = clamp(b, 0, B_MAX);

    }

    top() {
        if (this.position[1] > 0)
            return ledBoard[this.position[0]][this.position[1] - 1];
    }

    bottom() {
        if (this.position[1] < 15)
            return ledBoard[this.position[0]][this.position[1] + 1];
    }

    left() {
        if (this.position[0] > 0)
            return ledBoard[this.position[0] - 1][this.position[1]];
    }

    right() {
        if (this.position[0] < 15)
            return ledBoard[this.position[0] + 1][this.position[1]];
    }

    cross() {
        return [this.left(), this.right(), this.top(), this.bottom()];
    }

    diag() {
        let diag = [];

        if (this.left()) {
            if (this.left().top()) diag.push(this.left().top());
            if (this.left().bottom()) diag.push(this.left().bottom());
        }

        if (this.right()) {
            if (this.right().top()) diag.push(this.right().top());
            if (this.right().bottom()) diag.push(this.right().bottom());
        }

        return diag;
    }

    neighbor() {
        return this.diag().concat(this.cross());
    }
    changeColor(speed) {
        this.ledColor[0] += (this.targetColor[0] - this.ledColor[0]) * speed;
        this.ledColor[1] += (this.targetColor[1] - this.ledColor[1]) * speed;
        this.ledColor[2] += (this.targetColor[2] - this.ledColor[2]) * speed;
    }
    show() {
        push();
        translate(this.position[0] * this.size, this.position[1] * this.size);

        if (this.status) {
            fill(this.ledColor[0], this.ledColor[1], this.ledColor[2]);
        } else {
            // dim neutral gray in HSB space for off LEDs
            fill(0, 0, 60);
        }

        strokeWeight(0.5);
        stroke(B_MAX);
        circle(0, 0, this.size);

        strokeWeight(1.3);
        fill(0);
        text(this.id, this.size / 2, this.size / 2);

        pop();
    }
}

let ledBoard;
let ledSequence = new Array(256);
let previousMillis = 0;
const H_MAX = 360;
const S_MAX = 100;
const B_MAX = 100;
const ALPHA_MAX = 255;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrapHue = (h) => (h % H_MAX + H_MAX) % H_MAX;

function hexToHsb(hexValue) {
    const c = color(hexValue);
    return [hue(c), saturation(c), brightness(c)];
}

function randomColor() {
    for (let leds of ledBoard) {
        for (let led of leds) {
            led.setColor(random(H_MAX), random(S_MAX), random(B_MAX));
        }
    }
}

let showFlashColor = [0, 0, 0];

function flashColor(h, s, b, interval) {
    if (millis() - previousMillis >= interval) {
        if (
            showFlashColor[0] == 0 &&
            showFlashColor[1] == 0 &&
            showFlashColor[2] == 0
        ) {
            showFlashColor = [h, s, b];
        } else {
            showFlashColor = [0, 0, 0];
        }
        previousMillis = millis();
    }

    for (let leds of ledBoard) {
        for (let led of leds) {
            led.setColor(showFlashColor[0], showFlashColor[1], showFlashColor[2]);
        }
    }
}

function setColor(h, s, b) {
    for (let leds of ledBoard) {
        for (let led of leds) {
            led.setColor(h, s, b);
        }
    }
}

function setTargetColor(h, s, b) {
    for (let leds of ledBoard) {
        for (let led of leds) {
            led.setTargetColor(h, s, b);
        }
    }
}

function turnOffAll() {
    for (let leds of ledBoard) {
        for (let led of leds) {
            led.turnOff();
        }
    }
}

function setDuration(duration) {
    let time = millis();

    for (let leds of ledBoard) {
        for (let led of leds) {
            if (led.status && led.duration < 0) {
                led.duration = duration + time;
            } else if (led.duration > 0 && led.duration <= time) {
                led.turnOff();
            }
        }
    }
}

function pattern1Diag() {
    let changedLed = [];

    for (let leds of ledBoard) {
        for (let led of leds) {
            if (led.status) {
                for (let surroundLed of led.diag()) {

                    changedLed.push([surroundLed, led]);


                }
            }
        }
    }

    for (let led of changedLed) {
        if (!led[0]) continue;
        led[0].turnOn();
        const colorDifference = led[1].targetColor.map((c, i) => c - led[0].ledColor[i]);
        led[0].setTargetColor(
            wrapHue(led[0].ledColor[0] + 0.7 * colorDifference[0] + 0.2 * random(-noise, noise)),
            clamp(led[0].ledColor[1] + 0.7 * colorDifference[1] + 0.2 * random(-noise, noise), 0, S_MAX),
            clamp(led[0].ledColor[2] + 0.7 * colorDifference[2] + random(-noise, noise), 0, B_MAX)
        );
    }
}

let noise = 0;

function pattern1Cross() {
    let changedLed = [];

    for (let leds of ledBoard) {
        for (let led of leds) {
            if (led.status) {
                for (let surroundLed of led.cross()) {

                    changedLed.push([surroundLed, led]);

                }
            }
        }
    }

    for (let led of changedLed) {
        if (!led[0]) continue;
        led[0].turnOn();
        const colorDifference = led[1].targetColor.map((c, i) => c - led[0].ledColor[i]);
        led[0].setTargetColor(
            wrapHue(led[0].ledColor[0] + 0.7 * colorDifference[0] + 0.2 * random(-noise, noise)),
            clamp(led[0].ledColor[1] + 0.7 * colorDifference[1] + 0.2 * random(-noise, noise), 0, S_MAX),
            clamp(led[0].ledColor[2] + 0.7 * colorDifference[2] + random(-noise, noise), 0, B_MAX)
        );

    }
}

function pattern1Neighbor() {
    let changedLed = [];

    for (let leds of ledBoard) {
        for (let led of leds) {
            if (led.status) {
                for (let surroundLed of led.neighbor()) {

                    changedLed.push([surroundLed, led]);


                }
            }
        }
    }

    for (let led of changedLed) {
        if (!led[0]) continue;
        led[0].turnOn();
        const colorDifference = led[1].targetColor.map((c, i) => c - led[0].ledColor[i]);

        led[0].setTargetColor(
            wrapHue(led[0].ledColor[0] + 0.7 * colorDifference[0] + 0.2 * random(-noise, noise)),
            clamp(led[0].ledColor[1] + 0.7 * colorDifference[1] + 0.2 * random(-noise, noise), 0, S_MAX),
            clamp(led[0].ledColor[2] + 0.7 * colorDifference[2] + random(-noise, noise), 0, B_MAX)
        );

    }
}

function randomTurnOn(randomness) {
    if (random() > randomness) {
        let x = floor(random(1, 15));
        let y = floor(random(1, 15));
        ledBoard[x][y].turnOn();
        ledBoard[x][y].duration = 900 + millis();
        ledBoard[x + 1][y].turnOn();
        ledBoard[x][y + 1].turnOn();
        ledBoard[x - 1][y].turnOn();
        ledBoard[x][y - 1].turnOn();
        const [h, s, b] = ledColor;
        ledBoard[x][y].setTargetColor(h, s, b);
        ledBoard[x][y - 1].setTargetColor(h, s, b);
        ledBoard[x + 1][y].setTargetColor(h, s, b);
        ledBoard[x][y + 1].setTargetColor(h, s, b);
        ledBoard[x - 1][y].setTargetColor(h, s, b);
    }
}

let ledColor = [0, 0, 0];
let colorPicker;

let colorChangeSpeed = 0.7;

let canvas;
let pattern = ["cross"];
let randomness = 0.3;

function processColorInput(mode) {
    if (mode == "colorPicker") {
        console.log("color picker changed");
        const hexValue = colorPicker.value();
        const [h, s, b] = hexToHsb(hexValue);
        ledColor = [h, s, b];

        warmthControlSlider.value(map(h, 0, H_MAX - 140, 0, 100));
        brightnessControlSlider.value(map(b, 0, B_MAX, 0, 100));
    } else if (mode == "warmthControlSlider") {
        const h = map(warmthControlSlider.value(), 0, 100, 0, H_MAX - 140);
        ledColor[0] = h;
        const hexValue = colorPicker.value();
        const [, s, b] = hexToHsb(hexValue);
        ledColor[1] = s;
        ledColor[2] = b;
        colorPicker.value(color(ledColor[0], ledColor[1], ledColor[2]));
    } else if (mode == "brightnessControlSlider") {
        const b = map(brightnessControlSlider.value(), 0, 100, 10, B_MAX - 10);
        ledColor[2] = b;
        const hexValue = colorPicker.value();
        const [h, s,] = hexToHsb(hexValue);
        ledColor[0] = h;
        ledColor[1] = s;
        colorPicker.value(color(ledColor[0], ledColor[1], ledColor[2]));
    }

}

let warmthControlSlider;
let brightnessControlSlider;

async function setup1() {
    await preload1();
    canvas = createCanvas(1000, 1000);
    canvas.parent("ledBoardSimulation");
    colorMode(HSB, H_MAX, S_MAX, B_MAX, ALPHA_MAX);

    

    ellipseMode(CORNER);
    textAlign(CENTER, CENTER);

    ledBoard = new Array(16);

    for (let i = 0; i < 16; i++) {
        ledBoard[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            ledBoard[i][j] = new led(i, j);
        }
    }

    turnOffAll();
    ledBoard[7][7].turnOn();

}

async function draw() {
  if(frameCount==1){
    await setup1();
    return;
  }
    await new Promise(resolve => setTimeout(resolve, 100));
    frameRate(8);
    background(0);

    if (pattern.includes("diag")) pattern1Diag();
    if (pattern.includes("cross")) pattern1Cross();
    if (pattern.includes("surround")) pattern1Neighbor();

    randomTurnOn(randomness);

    setDuration(450);

    for (let leds of ledBoard) {
        for (let led of leds) {
            led.changeColor(colorChangeSpeed);
            if (led.id == 1) console.log(led);
            led.show();
        }
    }
}
