let readings = [];

function getReading() {
  // Get the most recent earthquake in the database
  let url =
    "https://arduino-test-5f775-default-rtdb.firebaseio.com/demo/current.json";
  httpGet(url, "jsonp", false, function (response) {
    // when the HTTP request completes, populate the variable that holds the
    // earthquake data used in the visualization.
    let arr = split(response, ", ");
    arr = int(arr);
    //print(arr)
    let c = color(arr);
    //print(c)
    
    //don't want any of the rects to be less than one pixel in length
    //so remove the oldest (first) item from the array
    if(readings.length >= width){
      readings.shift(); 
    }
     readings.push(c);
    //print(reading);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  getReading();
  // noStroke();
}

function draw() {
  background(220);

  if (readings.length > 0) {
    //only do this if there is a color to start with
    let w = round(width / readings.length);
 //   print(w);
    for (let i = 0; i < readings.length; i++) {
      fill(readings[i])
      stroke(readings[i]);
      rect(i * w, 0, w, height);
    }
  }

  //get a new color roughtly every 10 seconds
  if (frameCount % (60 * 10) == 0) {
    getReading();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
