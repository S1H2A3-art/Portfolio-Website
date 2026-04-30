/*
This program reads incoming ASCII serial data from Arduino in the form
of comma-separated values. It splits the incoming string at the commas,
converts the values into numbers, and uses them to control graphics in p5.js.
*/

//Variables for webserial/serial

// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button object:
let portButton;

//Variables for incoming serial data from arduino

let pot1 = 0;
let pot2 = 0;

function setup() {
  createCanvas(255, 255); // make the canvas

  // check to see if browser supports serial
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  } else {
    alert("Webserial works! 🥳");
  }

  // if serial is available, add connect/disconnect listeners
  // for when a device is plugged in, or removed
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);

  //////////////////////////////////////////////////////
  /// This section handles connection to the arduino ///
  //////////////////////////////////////////////////////

  // check for any ports that are available:
  serial.getPorts();

  //////////////////////////////////////////////////////
  /// makePortButton, openPort, portError, & serialEvent
  /// are all functions written further below in the program
  //////////////////////////////////////////////////////

  // if there's no port chosen, make a button to choose one:
  serial.on("noport", makePortButton);

  // open whatever port is available:
  serial.on("portavailable", openPort);

  // handle serial errors:
  serial.on("requesterror", portError);

  // handle any incoming serial data --- This is important!
  serial.on("data", serialEvent);

  // if the port closes, show the button again to reconnect
  serial.on("close", makePortButton);
}

function draw() {
  background(0, 0, 0);
  fill(255, 255, 255);

  // display incoming values
  text("Pot 1: " + pot1, 30, 30);
  text("Pot 2: " + pot2, 30, 50);

  // use pot1 to move the circle horizontally
  let x = map(pot1, 0, 255, 0, width);

  fill(0, pot1, 255);
  ellipse(pot1, height / 4, 50, 50);

  // use pot2 to control rotation of a rect
  //push/pop prevents translate/rotation from affecting the rest of sketch
  push();
  translate(width / 2, height / 2);
  rotate(radians(map(pot2, 0, 255, 0, 360)));
  rect(-50, -10, 100, 20);
  pop();
}

// if there's no port selected,
// make a port select button appear:
function makePortButton() {
  // create and position a port chooser button:
  portButton = createButton("choose port");
  portButton.position(10, 10);

  // give the port button a mousepressed handler:
  portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

// open the selected port, and make the port
// button invisible:
function openPort() {
  // wait for the serial.open promise to return,
  // then call the initiateSerial function
  serial.open({ baudRate: 9600 }).then(initiateSerial);

  // once the port opens, let the user know:
  function initiateSerial() {
    console.log("port open");
  }

  // hide the port button once a port is chosen:
  if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
  alert("Serial port error: " + err);
}

/////////////////////////////////////////////
//serialEvent() is where the magic happens///
////////////////////////////////////////////

// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
  // read one line from the serial buffer
  let data = serial.readLine();

  // if data exists then we need to parse it
  if (data) {
    // split the incoming string at each comma
    // into an array called values
    let values = split(data, ",");

    // check that we received two values
    if (values.length === 2) {
      // convert the values from strings to numbers
      // and assign to variables
      let newPot1 = Number(values[0]);
      let newPot2 = Number(values[1]);

      // make sure they are valid numbers
      if (!isNaN(newPot1) && !isNaN(newPot2)) {
        pot1 = newPot1;
        pot2 = newPot2;
      }
    }
  }
}

// try to connect if a new serial port
// gets added (i.e. plugged in via USB):
function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close();
}