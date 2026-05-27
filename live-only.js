// let data;
let max = 1920;

function preload() {
  // data = loadJSON(`https://micro-api.awdokku.site/api/readings/shades-of-blue?limit=${max}&device=${DEVICE_ID}`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // bars = data.readings;
  // console.log(readings);

  noStroke();
}

function draw() {
  background(220);
  let w = width/bars.length;
  print(w);

  for(let i = 0; i < bars.length; i++){
    let rgb = bars[i].values;
    fill(rgb.r, rgb.g, rgb.b);
    rect(i * w, 0, w + 1, height); //plus one hack on width
  }
  // debugger;
}

function keyPressed(){
  if(key == "g"){
    saveGif('thumb', floor(random(3, 8)));
  } else if(key == "p"){
    saveCanvas('thumb', "jpg");
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

